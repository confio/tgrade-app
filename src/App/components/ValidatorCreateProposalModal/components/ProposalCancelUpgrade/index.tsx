import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { ValidatorVotingContract } from "utils/validatorVoting";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationCancelUpgrade from "./components/ConfirmationCancelUpgrade";
import FormCancelUpgrade, { FormCancelUpgradeValues } from "./components/FormCancelUpgrade";

interface ProposalCancelUpgradeProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalCancelUpgrade({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalCancelUpgradeProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [comment, setComment] = useState("");

  async function submitCancelUpgrade({ comment }: FormCancelUpgradeValues) {
    setComment(comment);
    setProposalStep({ type: ProposalType.CancelUpgrade, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const validatorVotingContract = new ValidatorVotingContract(config, signingClient);
      const transactionHash = await validatorVotingContract.propose(address, comment, { cancel_upgrade: {} });

      setTxResult({
        msg: `Created proposal for cancelling upgrade. Transaction ID: ${transactionHash}`,
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
        <ConfirmationCancelUpgrade
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.CancelUpgrade })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormCancelUpgrade
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitCancelUpgrade}
        />
      )}
    </>
  );
}
