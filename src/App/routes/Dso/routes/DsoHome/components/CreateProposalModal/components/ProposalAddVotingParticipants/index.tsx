import { TxResult } from "App/components/logic/ShowTxResult";
import * as React from "react";
import { useState } from "react";
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
  const [members, setMembers] = useState<readonly string[]>([]);
  const [comment, setComment] = useState("");

  async function submitAddVotingParticipants({ members, comment }: FormAddVotingParticipantsValues) {
    setMembers(members);
    setComment(comment);
    setProposalStep({ type: ProposalType.AddVotingParticipants, confirmation: true });
  }

  async function submitCreateProposal() {
    setTxResult({ error: "Proposal not yet implemented" });
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
