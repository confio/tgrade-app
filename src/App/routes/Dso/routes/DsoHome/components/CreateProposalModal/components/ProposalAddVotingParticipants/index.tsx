import { TxResult } from "App/components/logic/ShowTxResult";
import * as React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getDsoName, useDso, useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { ProposalStep, ProposalType } from "../..";
import { DsoHomeParams } from "../../../..";
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
    sdkState: { address, signingClient },
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
    setSubmitting(true);

    try {
      const { transactionHash } = await signingClient.execute(address, dsoAddress, {
        propose: {
          title: "Add voting participants",
          description: comment,
          proposal: {
            add_voting_members: {
              voters: members,
            },
          },
        },
      });

      const dsoName = getDsoName(dsos, dsoAddress);
      setTxResult({
        msg: `Created proposal for adding voting participants to ${dsoName} (${dsoAddress}). Transaction ID: ${transactionHash}`,
      });
    } catch (error) {
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
          setMembers={setMembers}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitAddVotingParticipants}
        />
      )}
    </>
  );
}
