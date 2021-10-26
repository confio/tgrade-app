import { TxResult } from "App/components/ShowTxResult";
import { DsoHomeParams } from "App/pages/DsoHome";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getDsoName, useDso, useError, useSdk } from "service";
import { DsoContract } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";
import { ProposalStep, ProposalType } from "../..";
import ConfirmationAddVotingParticipants from "./components/ConfirmationAddVotingParticipants";
import FormAddVotingParticipants, {
  FormAddVotingParticipantsValues,
} from "./components/FormAddVotingParticipants";

interface ProposalAddVotingParticipantsProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalAddVotingParticipants({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalAddVotingParticipantsProps): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();
  const {
    dsoState: { dsos },
  } = useDso();

  const [members, setMembers] = useState<readonly string[]>([]);
  const [comment, setComment] = useState("");

  async function submitAddVotingParticipants({ members, comment }: FormAddVotingParticipantsValues) {
    setMembers(members);
    setComment(comment);
    setProposalStep({ type: ProposalType.AddVotingParticipants, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const dsoContract = new DsoContract(dsoAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.propose(
        signingClient,
        config.factoryAddress,
        address,
        comment,
        {
          add_voting_members: {
            voters: members,
          },
        },
      );

      const dsoName = getDsoName(dsos, dsoAddress);
      setTxResult({
        msg: `Created proposal for adding voting participants to ${dsoName} (${dsoAddress}). Transaction ID: ${transactionHash}`,
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
        <ConfirmationAddVotingParticipants
          members={members}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.AddVotingParticipants })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormAddVotingParticipants
          members={members}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitAddVotingParticipants}
        />
      )}
    </>
  );
}
