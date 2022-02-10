import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { CommunityPoolContract } from "utils/communityPool";
import { displayAmountToNative } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";

import ConfirmationSendTokens from "./components/ConfirmationSendTokens";
import FormSendTokens, { FormSendTokensValues } from "./components/FormSendTokens";

interface ProposalSendTokensProps {
  readonly confirmationStep: boolean;
  readonly setConfirmationStep: React.Dispatch<React.SetStateAction<boolean>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalSendTokens({
  confirmationStep,
  setConfirmationStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalSendTokensProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [receiver, setReceiver] = useState("");
  const [tokensAmount, setTokensAmount] = useState("");
  const [comment, setComment] = useState("");

  async function submitSendTokens({ receiver: member, tokensAmount: points, comment }: FormSendTokensValues) {
    setReceiver(member);
    setTokensAmount(points);
    setComment(comment);
    setConfirmationStep(true);
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const cPoolContract = new CommunityPoolContract(config, signingClient);
      const nativeAmount = displayAmountToNative(tokensAmount, config.coinMap, config.feeToken);
      const { txHash } = await cPoolContract.proposeSend(address, comment, {
        to_addr: receiver,
        amount: { denom: config.feeToken, amount: nativeAmount },
      });

      setTxResult({
        msg: `Created proposal for sending tokens from Community Pool. Transaction ID: ${txHash}`,
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
      {confirmationStep ? (
        <ConfirmationSendTokens
          receiver={receiver}
          tokensAmount={tokensAmount}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setConfirmationStep(false)}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormSendTokens
          receiver={receiver}
          tokensAmount={tokensAmount}
          comment={comment}
          handleSubmit={submitSendTokens}
        />
      )}
    </>
  );
}
