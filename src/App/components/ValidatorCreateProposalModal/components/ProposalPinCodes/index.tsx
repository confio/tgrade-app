import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { ValidatorVotingContract } from "utils/validatorVoting";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationPinCodes from "./components/ConfirmationPinCodes";
import FormPinCodes, { FormPinCodesValues } from "./components/FormPinCodes";

interface ProposalPinCodesProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalPinCodes({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalPinCodesProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [codeIds, setCodeIds] = useState<readonly string[]>([]);
  const [comment, setComment] = useState("");

  async function submitPinCodes({ codeIds, comment }: FormPinCodesValues) {
    setCodeIds(codeIds);
    setComment(comment);
    setProposalStep({ type: ProposalType.PinCodes, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const validatorVotingContract = new ValidatorVotingContract(config, signingClient);
      const codeIdNumbers = codeIds.map((codeId) => parseInt(codeId, 10));
      const { txHash } = await validatorVotingContract.propose(address, comment, {
        pin_codes: codeIdNumbers,
      });

      setTxResult({
        msg: `Created proposal for pinning codes. Transaction ID: ${txHash}`,
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
        <ConfirmationPinCodes
          codeIds={codeIds}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.PinCodes })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormPinCodes
          codeIds={codeIds}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitPinCodes}
        />
      )}
    </>
  );
}
