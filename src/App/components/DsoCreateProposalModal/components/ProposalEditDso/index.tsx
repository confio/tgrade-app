import { TxResult } from "App/components/ShowTxResult";
import { DsoHomeParams } from "App/pages/DsoHome";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { displayAmountToNative, nativeCoinToDisplay } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { TcContract, TcContractQuerier } from "utils/trustedCircle";

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
    sdkState: { config, client, address, signingClient },
  } = useSdk();

  const [currentDsoValues, setCurrentDsoValues] = useState<Omit<FormEditDsoValues, "comment">>({
    dsoName: "",
    quorum: "",
    threshold: "",
    votingDuration: "",
    escrowAmount: "",
    earlyPass: true,
  });
  const [dsoName, setDsoName] = useState("");
  const [quorum, setQuorum] = useState("");
  const [threshold, setThreshold] = useState("");
  const [votingDuration, setVotingDuration] = useState("");
  const [escrowAmount, setEscrowAmount] = useState("");
  const [earlyPass, setEarlyPass] = useState(true);
  const [comment, setComment] = useState("");

  useEffect(() => {
    (async function queryDso() {
      if (!client) return;

      try {
        const dsoContract = new TcContractQuerier(dsoAddress, client);
        const dsoResponse = await dsoContract.getTc();
        const quorum = (parseFloat(dsoResponse.rules.quorum) * 100).toFixed(2).toString();
        const threshold = (parseFloat(dsoResponse.rules.threshold) * 100).toFixed(2).toString();
        const escrowAmount = nativeCoinToDisplay(
          { denom: config.feeToken, amount: dsoResponse.escrow_amount },
          config.coinMap,
        ).amount;

        setCurrentDsoValues({
          dsoName: dsoResponse.name,
          quorum,
          threshold,
          votingDuration: dsoResponse.rules.voting_period.toString(),
          escrowAmount,
          earlyPass: dsoResponse.rules.allow_end_early,
        });

        setDsoName(dsoResponse.name);
        setQuorum(quorum);
        setThreshold(threshold);
        setVotingDuration(dsoResponse.rules.voting_period.toString());
        setEscrowAmount(escrowAmount);
        setEarlyPass(dsoResponse.rules.allow_end_early);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, config.coinMap, config.feeToken, dsoAddress, handleError]);

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
    if (!signingClient || !client || !address) return;
    setSubmitting(true);

    try {
      const nativeEscrowAmount = displayAmountToNative(escrowAmount, config.coinMap, config.feeToken);
      const nativeQuorum = quorum ? (parseFloat(quorum) / 100).toString() : undefined;
      const nativethreshold = threshold ? (parseFloat(threshold) / 100).toString() : undefined;

      const dsoContract = new TcContract(dsoAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.propose(address, comment, {
        edit_trusted_circle: {
          name: dsoName === currentDsoValues.dsoName ? undefined : dsoName,
          escrow_amount: nativeEscrowAmount,
          voting_period:
            votingDuration === currentDsoValues.votingDuration ? undefined : parseInt(votingDuration, 10),
          quorum: quorum === currentDsoValues.quorum ? undefined : nativeQuorum,
          threshold: threshold === currentDsoValues.threshold ? undefined : nativethreshold,
          allow_end_early: earlyPass === currentDsoValues.earlyPass ? undefined : earlyPass,
        },
      });

      setTxResult({
        msg: `Created proposal for editing ${dsoName} (${dsoAddress}). Transaction ID: ${transactionHash}`,
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
        <ConfirmationEditDso
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.EditDso })}
          submitForm={submitCreateProposal}
          dsoName={dsoName === currentDsoValues.dsoName ? undefined : dsoName}
          quorum={quorum === currentDsoValues.quorum ? undefined : quorum}
          threshold={threshold === currentDsoValues.threshold ? undefined : threshold}
          votingDuration={votingDuration === currentDsoValues.votingDuration ? undefined : votingDuration}
          escrowAmount={escrowAmount === currentDsoValues.escrowAmount ? undefined : escrowAmount}
          earlyPass={earlyPass === currentDsoValues.earlyPass ? undefined : earlyPass}
          comment={comment}
        />
      ) : (
        <FormEditDso
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitEditDso}
          currentDsoValues={currentDsoValues}
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
