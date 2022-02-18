import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { OcContract } from "utils/oversightCommunity";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationUnjailValidator from "./ConfirmationUnjailValidator";
import FormUnjailValidator, { FormUnjailValidatorValues } from "./FormUnjailValidator";

interface ProposalUnjailValidtorProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalUnjailValidator({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalUnjailValidtorProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [validator, setValidator] = useState("");
  const [comment, setComment] = useState("");

  async function submitUnjailValidator({ validator, comment }: FormUnjailValidatorValues) {
    setValidator(validator);
    setComment(comment);

    setProposalStep({ type: ProposalType.UnjailValidator, confirmation: true });
  }
  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const ocContract = new OcContract(config, signingClient);

      const { txHash } = await ocContract.propose(address, comment, {
        unjail: {
          member: validator,
          comment,
        },
      });

      setTxResult({
        msg: `Created proposal for punishing validator to Oversight Community. Transaction ID: ${txHash}`,
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
        <ConfirmationUnjailValidator
          validatorToUnjail={validator}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.PunishValidator })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormUnjailValidator
          validator={validator}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitUnjailValidator}
        />
      )}
    </>
  );
}
