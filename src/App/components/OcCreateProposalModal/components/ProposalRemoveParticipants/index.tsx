import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useOc, useSdk } from "service";
import { DsoContract } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationRemoveParticipants from "./components/ConfirmationRemoveParticipants";
import FormRemoveParticipants, { FormRemoveParticipantsValues } from "./components/FormRemoveParticipants";

interface ProposalRemoveParticipantsProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalRemoveParticipants({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalRemoveParticipantsProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();
  const {
    ocState: { ocAddress },
  } = useOc();

  const [members, setMembers] = useState<readonly string[]>([]);
  const [comment, setComment] = useState("");

  async function submitRemoveParticipants({ members, comment }: FormRemoveParticipantsValues) {
    setMembers(members);
    setComment(comment);
    setProposalStep({ type: ProposalType.RemoveParticipants, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!ocAddress || !signingClient || !address) return;
    setSubmitting(true);

    try {
      const dsoContract = new DsoContract(ocAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.propose(
        signingClient,
        config.factoryAddress,
        address,
        comment,
        {
          add_remove_non_voting_members: {
            remove: members,
            add: [],
          },
        },
      );

      setTxResult({
        msg: `Created proposal for removing participants from Oversight Committee (${ocAddress}). Transaction ID: ${transactionHash}`,
      });
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {proposalStep.confirmation ? (
        <ConfirmationRemoveParticipants
          members={members}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.RemoveParticipants })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormRemoveParticipants
          members={members}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitRemoveParticipants}
        />
      )}
    </>
  );
}
