import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { ValidatorVotingContract } from "utils/validatorVoting";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationUnpinCodes from "./components/ConfirmationUnpinCodes";
import FormUnpinCodes, { FormUnpinCodesValues } from "./components/FormUnpinCodes";

interface ProposalUnpinCodesProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalUnpinCodes({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalUnpinCodesProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [codeIds, setCodeIds] = useState<readonly string[]>([]);
  const [comment, setComment] = useState("");

  async function submitUnpinCodes({ codeIds, comment }: FormUnpinCodesValues) {
    setCodeIds(codeIds);
    setComment(comment);
    setProposalStep({ type: ProposalType.UnpinCodes, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const validatorVotingContract = new ValidatorVotingContract(config, signingClient);
      const codeIdNumbers = codeIds.map((codeId) => parseInt(codeId, 10));
      const { txHash } = await validatorVotingContract.propose(address, comment, {
        unpin_codes: codeIdNumbers,
      });

      setTxResult({
        msg: `Created proposal for unpinning codes. Transaction ID: ${txHash}`,
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
        <ConfirmationUnpinCodes
          codeIds={codeIds}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.UnpinCodes })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormUnpinCodes
          codeIds={codeIds}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitUnpinCodes}
        />
      )}
    </>
  );
}
