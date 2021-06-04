import { TxResult } from "App/components/logic/ShowTxResult";
import { DsoHomeParams } from "App/routes/Dso/routes/DsoHome";
import * as React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDso, useError, useSdk } from "service";
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

  async function submitAddParticipants({ members, comment }: FormAddParticipantsValues) {
    setMembers(members);
    setComment(comment);
    setProposalStep({ type: ProposalType.AddParticipants, confirmation: true });
  }

  async function submitCreateProposal() {
    setSubmitting(true);

    try {
      const { transactionHash } = await signingClient.execute(address, dsoAddress, {
        propose: {
          title: "Add participants",
          description: comment,
          proposal: {
            add_remove_non_voting_members: {
              remove: [],
              add: members,
            },
          },
        },
      });

      const [, dsoName = "DSO"] = dsos.find(([address]) => address === dsoAddress) ?? [];

      setTxResult({
        msg: `Created proposal for adding participants to ${dsoName} (${dsoAddress}). Transaction ID: ${transactionHash}`,
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
        <ConfirmationAddParticipants
          members={members}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.AddParticipants })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormAddParticipants
          members={members}
          setMembers={setMembers}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitAddParticipants}
        />
      )}
    </>
  );
}
