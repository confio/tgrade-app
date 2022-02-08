import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { ValidatorVotingContract } from "utils/validatorVoting";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationUpdateConsensusBlockParams from "./components/ConfirmationUpdateConsensusBlockParams";
import FormUpdateConsensusBlockParams, {
  FormUpdateConsensusBlockParamsValues,
} from "./components/FormUpdateConsensusBlockParams";

interface ProposalUpdateConsensusBlockParamsProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalUpdateConsensusBlockParams({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalUpdateConsensusBlockParamsProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [maxBytes, setMaxBytes] = useState("");
  const [maxGas, setMaxGas] = useState("");
  const [comment, setComment] = useState("");

  async function submitUpdateConsensusBlockParams({
    maxBytes,
    maxGas,
    comment,
  }: FormUpdateConsensusBlockParamsValues) {
    setMaxBytes(maxBytes);
    setMaxGas(maxGas);
    setComment(comment);
    setProposalStep({ type: ProposalType.UpdateConsensusBlockParams, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const validatorVotingContract = new ValidatorVotingContract(config, signingClient);
      const { txHash } = await validatorVotingContract.propose(address, comment, {
        update_consensus_block_params: { max_bytes: parseInt(maxBytes, 10), max_gas: parseInt(maxGas, 10) },
      });

      setTxResult({
        msg: `Created proposal for updating consensus block params. Transaction ID: ${txHash}`,
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
        <ConfirmationUpdateConsensusBlockParams
          maxBytes={maxBytes}
          maxGas={maxGas}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.UpdateConsensusBlockParams })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormUpdateConsensusBlockParams
          maxBytes={maxBytes}
          maxGas={maxGas}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitUpdateConsensusBlockParams}
        />
      )}
    </>
  );
}
