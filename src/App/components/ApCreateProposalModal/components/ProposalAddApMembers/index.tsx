import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { ApContract } from "utils/arbiterPool";
import { getErrorFromStackTrace } from "utils/errors";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationAddOCMembers from "./components/ConfirmationAddApMembers";
import FormAddOCMembers, { FormAddOCMembersValues } from "./components/FormAddApMembers";

interface ProposalAddOCMembersProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalAddOCMembers({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalAddOCMembersProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [members, setMembers] = useState<readonly string[]>([]);
  const [comment, setComment] = useState("");

  async function submitAddOCMembers({ members, comment }: FormAddOCMembersValues) {
    setMembers(members);
    setComment(comment);
    setProposalStep({ type: ProposalType.AddOCMembers, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const ocContract = new ApContract(config, signingClient);
      const { txHash } = await ocContract.propose(address, comment, {
        add_voting_members: {
          voters: members,
        },
      });

      setTxResult({
        msg: `Created proposal for adding members to Oversight Community. Transaction ID: ${txHash}`,
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
        <ConfirmationAddOCMembers
          members={members}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.AddOCMembers })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormAddOCMembers
          members={members}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitAddOCMembers}
        />
      )}
    </>
  );
}
