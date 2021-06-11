import { TxResult } from "App/components/logic/ShowTxResult";
import { DsoHomeParams } from "App/routes/Dso/routes/DsoHome";
import * as React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { ProposalStep, ProposalType } from "../..";
import ConfirmationEditDso from "./components/ConfirmationEditDso";
import FormEditDso, { FormEditDsoValues } from "./components/FormEditDso";

interface ProposalEditDsoProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalEditDso({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalEditDsoProps): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient },
  } = useSdk();

  const [dsoName, setDsoName] = useState("");
  const [quorum, setQuorum] = useState("");
  const [threshold, setThreshold] = useState("");
  const [votingDuration, setVotingDuration] = useState("");
  const [escrowAmount, setEscrowAmount] = useState("");
  const [earlyPass, setEarlyPass] = useState(true);
  const [comment, setComment] = useState("");

  function submitEditDso({
    dsoName,
    quorum,
    threshold,
    votingDuration,
    escrowAmount,
    earlyPass,
    comment,
  }: FormEditDsoValues) {
    setDsoName(dsoName);
    setQuorum(quorum);
    setThreshold(threshold);
    setVotingDuration(votingDuration);
    setEscrowAmount(escrowAmount);
    setEarlyPass(earlyPass);
    setComment(comment);
    setProposalStep({ type: ProposalType.EditDso, confirmation: true });
  }

  async function submitCreateProposal() {
    setSubmitting(true);

    try {
      //const nativeEscrowAmount = displayAmountToNative(escrowAmount, config.coinMap, config.feeToken);

      const { transactionHash } = await signingClient.execute(address, dsoAddress, {
        propose: {
          title: "Edit DSO",
          description: comment,
          proposal: {
            edit_dso: {
              name: dsoName || undefined,
              //escrow_amount: nativeEscrowAmount,
              voting_period: votingDuration ? parseInt(votingDuration, 10) : undefined,
              quorum: quorum ? (parseFloat(quorum) / 100).toString() : undefined,
              threshold: threshold ? (parseFloat(threshold) / 100).toString() : undefined,
              allow_end_early: earlyPass,
            },
          },
        },
      });

      setTxResult({
        msg: `Created proposal for editing ${dsoName} (${dsoAddress}). Transaction ID: ${transactionHash}`,
      });
    } catch (error) {
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {proposalStep.confirmation ? (
        <ConfirmationEditDso
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.EditDso })}
          submitForm={submitCreateProposal}
          dsoName={dsoName}
          quorum={quorum}
          threshold={threshold}
          votingDuration={votingDuration}
          escrowAmount={escrowAmount}
          earlyPass={earlyPass}
          comment={comment}
        />
      ) : (
        <FormEditDso
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitEditDso}
          dsoName={dsoName}
          quorum={quorum}
          threshold={threshold}
          votingDuration={votingDuration}
          escrowAmount={escrowAmount}
          earlyPass={earlyPass}
          comment={comment}
        />
      )}
    </>
  );
}
