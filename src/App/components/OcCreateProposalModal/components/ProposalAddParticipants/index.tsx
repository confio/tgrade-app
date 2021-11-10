import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useOc, useSdk } from "service";
import { DsoContract } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationAddParticipants from "./components/ConfirmationAddParticipants";
import FormAddParticipants, { FormAddParticipantsValues } from "./components/FormAddParticipants";

interface ProposalAddParticipantsProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalAddParticipants({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalAddParticipantsProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();
  const {
    ocState: { ocAddress },
  } = useOc();

  const [members, setMembers] = useState<readonly string[]>([]);
  const [comment, setComment] = useState("");

  async function submitAddParticipants({ members, comment }: FormAddParticipantsValues) {
    setMembers(members);
    setComment(comment);
    setProposalStep({ type: ProposalType.AddParticipants, confirmation: true });
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
            remove: [],
            add: members,
          },
        },
      );

      setTxResult({
        msg: `Created proposal for adding participants to Oversight Community (${ocAddress}). Transaction ID: ${transactionHash}`,
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
        <ConfirmationAddParticipants
          members={members}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.AddParticipants })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormAddParticipants
          members={members}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitAddParticipants}
        />
      )}
    </>
  );
}
