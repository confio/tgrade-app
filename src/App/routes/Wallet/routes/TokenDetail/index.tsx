import { Coin } from "@cosmjs/launchpad";
import { isBroadcastTxFailure } from "@cosmjs/stargate";
import { Typography } from "antd";
import { Stack } from "App/components/layout";
import { TokenAmount } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { setInitialLayoutState, setLoading, useError, useLayout, useSdk } from "service";
import { displayAmountToNative, nativeCoinToDisplay, useBalance } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import FormSendTokens, { FormSendTokensValues } from "./FormSendTokens";

const { Title, Text } = Typography;

const pathTokens = `${paths.wallet.prefix}${paths.wallet.tokens}`;

interface TokenDetailParams {
  readonly tokenName: string;
}

export default function TokenDetail(): JSX.Element {
  const { t } = useTranslation("wallet");

  const history = useHistory();
  const { url: pathTokenDetailMatched } = useRouteMatch();
  const { tokenName }: TokenDetailParams = useParams();

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathTokens } }), [
    layoutDispatch,
  ]);

  const { handleError } = useError();
  const {
    sdkState: { config, address, signingClient },
  } = useSdk();
  const balance = useBalance();

  const [tokenAmount, setTokenAmount] = useState("0");

  useEffect(() => {
    let mounted = true;

    (async function updateTokenAmount(): Promise<void> {
      try {
        const coin = balance.find((coin) => coin.denom === tokenName);
        const amount = coin?.amount ?? "0";
        if (mounted) setTokenAmount(amount);
      } catch (error) {
        if (mounted) setTokenAmount("0");
        handleError(error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [balance, handleError, tokenName]);

  async function sendTokensAction(values: FormSendTokensValues): Promise<void> {
    setLoading(layoutDispatch, `Sending ${nameToDisplay}...`);
    const { address: recipientAddress, amount } = values;

    try {
      const amountToTransfer = displayAmountToNative(amount, config.coinMap, tokenName);
      const nativeTokenToTransfer: Coin = { denom: tokenName, amount: amountToTransfer };
      const transferAmount: readonly Coin[] = [nativeTokenToTransfer];

      const response = await signingClient.sendTokens(address, recipientAddress, transferAmount);
      if (isBroadcastTxFailure(response)) {
        throw new Error(response.rawLog);
      }

      const denom = config.coinMap[tokenName].denom;
      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("sendSuccess", { amount, denom, recipientAddress }),
          customButtonText: t("tokens"),
          customButtonActionPath: `${paths.wallet.prefix}${paths.wallet.tokens}`,
        } as OperationResultState,
      });
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("sendFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathTokenDetailMatched,
        } as OperationResultState,
      });
    }
  }

  const nativeToken: Coin = { denom: tokenName, amount: tokenAmount };
  // TODO: Add try catch so it does not fail i.e. too many decimals
  const { denom: nameToDisplay, amount: amountToDisplay } = nativeCoinToDisplay(nativeToken, config.coinMap);
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");

  return (
    <Stack gap="s4">
      <Title>{nameToDisplay}</Title>
      <TokenAmount>
        <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
        {amountDecimal && <Text>{amountDecimal}</Text>}
        <Text>{` ${t("tokens")}`}</Text>
      </TokenAmount>
      <FormSendTokens
        tokenName={nameToDisplay}
        maxAmount={amountToDisplay}
        sendTokensAction={sendTokensAction}
      />
    </Stack>
  );
}
