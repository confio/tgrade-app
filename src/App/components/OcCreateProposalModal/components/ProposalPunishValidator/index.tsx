import { Decimal } from "@cosmjs/math";
import { TxResult } from "App/components/ShowTxResult";
import moment from "moment";
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
  const {
    ocState: { ocProposalsAddress },
  } = useOc();
  const [validators, setValidators] = useState("");
  const [slashPortion, setSlashPortion] = useState("");
  const [comment, setComment] = useState("");
  const [jailedForever, setJailedForever] = useState("");
  const [jailedUntil, setJailedUntil] = useState("");
  const [punishment, setPunishment] = useState("");

  async function submitPunishValidator({
    validators,
    comment,
    slashPortion,
    jailedUntil,
    jailedForever,
    punishment,
  }: FormPunishValidatorValues) {
    setValidators(validators);
    setSlashPortion(slashPortion);
    setComment(comment);
    setJailedUntil(jailedUntil);
    setJailedForever(jailedForever);
    setPunishment(punishment);
    setProposalStep({ type: ProposalType.PunishValidator, confirmation: true });
  }
  async function submitCreateProposal() {
    if (!ocProposalsAddress || !signingClient || !address) return;
    setSubmitting(true);
    console.log("submitCreateProposal fired");
    console.log("Validators to punish", validators);
    console.log("slash portion", slashPortion);
    console.log("jailForever", jailedForever);
    console.log("jailUntil", jailedUntil);
    console.log("punishment", punishment);
    console.log("comment", comment);
    try {
      const dsoContract = new DsoContract(ocProposalsAddress, signingClient, config.gasPrice);
      const nativePortion = slashPortion ? (parseFloat(slashPortion) / 100).toString() : "0";
      const jailedTo = jailedUntil ? jailedUntil : "10/10/2022";
      const jailTime = jailedForever ? "forever" : { duration: moment(jailedTo, "DD/MM/YYYY").unix() };

      const transactionHash = await dsoContract.propose(
        signingClient,
        config.factoryAddress,
        address,
        comment,
        {
          punish: {
            member: validators,
            portion: nativePortion,
            jailing_duration: jailTime,
          },
        },
      );

      setTxResult({
        msg: `Created proposal for punishing validator to Oversight Community (${ocProposalsAddress}). Transaction ID: ${transactionHash}`,
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
          validatorToPunish={validators}
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
          validators={validators}
          slashPortion={slashPortion}
          comment={comment}
          jailedForever={jailedForever}
          jailedUntil={jailedUntil}
          punishment={punishment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitPunishValidator}
        />
      )}
    </>
  );
}
