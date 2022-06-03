import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { ApContract } from "utils/arbiterPool";
import { getErrorFromStackTrace } from "utils/errors";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationOpenText from "./components/ConfirmationOpenText";
import FormOpenText, { FormOpenTextValues } from "./components/FormOpenText";

interface ProposalOpenTextProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalOpenText({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalOpenTextProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [text, setText] = useState("");

  async function submitOpenText({ text }: FormOpenTextValues) {
    setText(text);
    setProposalStep({ type: ProposalType.OpenText, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const ocContract = new ApContract(config, signingClient);
      const { txHash } = await ocContract.propose(address, text, { text: {} });

      setTxResult({
        msg: `Created proposal for Open Text from Oversight Community Proposals. Transaction ID: ${txHash}`,
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
        <ConfirmationOpenText
          text={text}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.OpenText })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormOpenText text={text} goBack={() => setProposalStep(undefined)} handleSubmit={submitOpenText} />
      )}
    </>
  );
}
