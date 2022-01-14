import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { ValidatorVotingContract } from "utils/validatorVoting";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationUpdateConsensusEvidenceParams from "./components/ConfirmationUpdateConsensusEvidenceParams";
import FormUpdateConsensusEvidenceParams, {
  FormUpdateConsensusEvidenceParamsValues,
} from "./components/FormUpdateConsensusEvidenceParams";

interface ProposalUpdateConsensusEvidenceParamsProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalUpdateConsensusEvidenceParams({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalUpdateConsensusEvidenceParamsProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [maxAgeNumBlocks, setMaxAgeNumBlocks] = useState("");
  const [maxAgeDuration, setMaxAgeDuration] = useState("");
  const [maxBytes, setMaxBytes] = useState("");
  const [comment, setComment] = useState("");

  async function submitUpdateConsensusEvidenceParams({
    maxAgeNumBlocks,
    maxAgeDuration,
    maxBytes,
    comment,
  }: FormUpdateConsensusEvidenceParamsValues) {
    setMaxAgeNumBlocks(maxAgeNumBlocks);
    setMaxAgeDuration(maxAgeDuration);
    setMaxBytes(maxBytes);
    setComment(comment);
    setProposalStep({ type: ProposalType.UpdateConsensusEvidenceParams, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const validatorVotingContract = new ValidatorVotingContract(config, signingClient);
      const transactionHash = await validatorVotingContract.propose(address, comment, {
        update_consensus_evidence_params: {
          max_age_num_blocks: parseInt(maxAgeNumBlocks, 10),
          max_age_duration: parseInt(maxAgeDuration, 10),
          max_bytes: parseInt(maxBytes, 10),
        },
      });

      setTxResult({
        msg: `Created proposal for updating consensus evidence params. Transaction ID: ${transactionHash}`,
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
        <ConfirmationUpdateConsensusEvidenceParams
          maxAgeNumBlocks={maxAgeNumBlocks}
          maxAgeDuration={maxAgeDuration}
          maxBytes={maxBytes}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.UpdateConsensusEvidenceParams })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormUpdateConsensusEvidenceParams
          maxAgeNumBlocks={maxAgeNumBlocks}
          maxAgeDuration={maxAgeDuration}
          maxBytes={maxBytes}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitUpdateConsensusEvidenceParams}
        />
      )}
    </>
  );
}
