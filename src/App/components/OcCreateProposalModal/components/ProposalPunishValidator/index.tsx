import { Radio } from "antd";
import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useOc, useSdk } from "service";
import { DsoContract } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationPunishValidator from "./ConfirmationPunishValidator";
import FormPunishValidator, { FormPunishValidatorValues } from "./FormPunishValidator";
interface ProposalPunishValidtorProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalPunishValidtor({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalPunishValidtorProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();
  const {
    ocState: { ocAddress },
  } = useOc();
  const [validatorsToPunish, setValidatorsToPunish] = useState([""]);
  const [slashingPercentage, setSlashingPercentage] = useState(0);
  const [comment, setComment] = useState("");

  async function submitPunishValidator({
    validatorsToPunish,
    comment,
    slashingPercentage,
  }: FormPunishValidatorValues) {
    setValidatorsToPunish(validatorsToPunish);
    setSlashingPercentage(slashingPercentage);
    setComment(comment);
    setProposalStep({ type: ProposalType.PunishValidator, confirmation: true });
  }
  async function submitCreateProposal() {
    if (!ocAddress || !signingClient || !address) return;
    setSubmitting(true);
    console.log("submitCreateProposal fired");
    console.log("Validators to punish", validatorsToPunish);
    console.log("slashing percentage", slashingPercentage);
    console.log("comment", comment);

    try {
      const dsoContract = new DsoContract(ocAddress, signingClient, config.gasPrice);
      const nativeSlashing = slashingPercentage ? (slashingPercentage / 100).toString() : "0";

      const transactionHash = await dsoContract.propose(
        signingClient,
        config.factoryAddress,
        address,
        comment,
        { punish_members: [] },
      );

      setTxResult({
        msg: `Created proposal for punishing validator to Oversight Community (${ocAddress}). Transaction ID: ${transactionHash}`,
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
        <ConfirmationPunishValidator
          validatorToPunish={validatorsToPunish}
          slashingPercentage="20"
          jail={false}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.PunishValidator })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormPunishValidator
          validatorsToPunish={validatorsToPunish}
          slashingPercentage={slashingPercentage}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitPunishValidator}
        />
      )}
    </>
  );
}
