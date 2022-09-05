import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { ApContract } from "utils/arbiterPool";
import { getErrorFromStackTrace } from "utils/errors";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationProposeArbiters from "./components/ConfirmationAddOCMembers";
import FormProposeArbiters, { FormProposeArbitersValues } from "./components/FormProposeArbiters";

interface ProposalProposeArbitersProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalProposeArbiters({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalProposeArbitersProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [complaintId, setComplaintId] = useState("");
  const [arbiters, setArbiters] = useState<readonly string[]>([]);
  const [comment, setComment] = useState("");

  async function submitAddOCMembers({ complaintId, members, comment }: FormProposeArbitersValues) {
    setComplaintId(complaintId);
    setArbiters(members);
    setComment(comment);
    setProposalStep({ type: ProposalType.ProposeArbiters, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address || complaintId === undefined) return;
    setSubmitting(true);

    try {
      const apContract = new ApContract(config, signingClient);
      const { txHash } = await apContract.propose(address, comment, {
        propose_arbiters: {
          case_id: Number(complaintId),
          arbiters,
        },
      });

      setTxResult({
        msg: `Created proposal for proposing arbiters to complaint ${complaintId} on Arbiter Pool. Transaction ID: ${txHash}`,
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
        <ConfirmationProposeArbiters
          complaintId={complaintId}
          members={arbiters}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.ProposeArbiters })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormProposeArbiters
          complaintId={complaintId}
          members={arbiters}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitAddOCMembers}
        />
      )}
    </>
  );
}
