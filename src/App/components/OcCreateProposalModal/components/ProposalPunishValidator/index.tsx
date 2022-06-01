import { TxResult } from "App/components/ShowTxResult";
import moment from "moment";
import { useState } from "react";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { OcContract } from "utils/oversightCommunity";

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

export default function ProposalPunishValidator({
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

  const [validator, setValidator] = useState("");
  const [slashPortion, setSlashPortion] = useState("");
  const [comment, setComment] = useState("");
  const [jailedForever, setJailedForever] = useState("");
  const [jailedUntil, setJailedUntil] = useState("");

  async function submitPunishValidator({
    validator,
    comment,
    slashPortion,
    jailedUntil,
    jailedForever,
  }: FormPunishValidatorValues) {
    setValidator(validator);
    setSlashPortion(slashPortion);
    setComment(comment);
    setJailedUntil(jailedUntil);
    setJailedForever(jailedForever);
    setProposalStep({ type: ProposalType.PunishValidator, confirmation: true });
  }
  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const ocContract = new OcContract(config, signingClient);
      const nativePortion = slashPortion ? (parseFloat(slashPortion) / 100).toString() : "0";
      const jailedTo = jailedUntil ? jailedUntil : 0;
      const dateToSeconds = Math.round(moment(jailedTo, "DD/MM/YYYY").unix() - new Date().getTime() / 1000);
      const jailTime = jailedForever
        ? { forever: {} }
        : { duration: Number.isNaN(dateToSeconds) ? 0 : dateToSeconds };

      const { txHash } = await ocContract.propose(address, comment, {
        punish: {
          member: validator,
          portion: nativePortion,
          jailing_duration: jailTime,
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
        <ConfirmationPunishValidator
          validatorToPunish={validator}
          slashingPercentage={slashPortion}
          jail={jailedForever}
          jailedUntil={jailedUntil}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.PunishValidator })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormPunishValidator
          validator={validator}
          slashPortion={slashPortion}
          comment={comment}
          jailedForever={jailedForever}
          jailedUntil={jailedUntil}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitPunishValidator}
        />
      )}
    </>
  );
}
