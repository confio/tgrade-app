import { Coin } from "@cosmjs/stargate";
import { Decimal } from "@cosmjs/math";
import { isBroadcastTxFailure } from "@cosmjs/stargate";
import { Typography } from "antd";
import { OldPageLayout, Stack } from "App/components/layout";
import { TokenAmount } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { setInitialLayoutState, setLoading, useError, useLayout, useSdk } from "service";
import { displayAmountToNative, nativeCoinToDisplay, useBalance } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import FormSendTokens, { FormSendTokensValues } from "./FormSendTokens";

const { Title, Text } = Typography;

const pathTokens = `${paths.wallet.prefix}${paths.wallet.tokens}`;

interface MutationVariables {
  readonly recipientAddress: string;
  readonly transferAmount: readonly Coin[];
}

interface TokenParams {
  readonly tokenName: string;
}

export default function Token(): JSX.Element {
  const { t } = useTranslation("wallet");

  const history = useHistory();
  const { url: pathTokenDetailMatched } = useRouteMatch();
  const { tokenName }: TokenParams = useParams();

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathTokens } }), [
    layoutDispatch,
  ]);

  const { handleError } = useError();
  const {
    sdkState: { config, address, signingClient },
  } = useSdk();

  const balance = useBalance();
  const nativeToken = useMemo(
    () => balance.find((coin) => coin.denom === tokenName) ?? { denom: tokenName, amount: "0" },
    [balance, tokenName],
  );

  const [tokenToDisplay, setTokenToDisplay] = useState<Coin>({ denom: "", amount: "0" });
  useEffect(() => {
    try {
      const tokenToDisplay = nativeCoinToDisplay(nativeToken, config.coinMap);
      setTokenToDisplay(tokenToDisplay);
    } catch (error) {
      handleError(error);
    }
  }, [config.coinMap, handleError, nativeToken]);

  async function mutationFn({ recipientAddress, transferAmount }: MutationVariables) {
    const response = await signingClient.sendTokens(address, recipientAddress, transferAmount);
    if (isBroadcastTxFailure(response)) {
      throw new Error(response.rawLog);
    }
  }

  const mutationOptions = {
    mutationKey: "sendTokens",
    onError: (stackTrace: Error) => {
      handleError(stackTrace);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("sendFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathTokenDetailMatched,
        } as OperationResultState,
      });
    },
    onSuccess: (_: void, { recipientAddress, transferAmount }: MutationVariables) => {
      const { amount, denom } = nativeCoinToDisplay(transferAmount[0], config.coinMap);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("sendSuccess", { amount, denom, recipientAddress }),
          customButtonText: t("tokens"),
          customButtonActionPath: `${paths.wallet.prefix}${paths.wallet.tokens}`,
        } as OperationResultState,
      });
    },
    onSettled: () => setLoading(layoutDispatch, false),
  };

  const { mutate } = useMutation(mutationFn, mutationOptions);

  function sendTokens({ address: recipientAddress, amount }: FormSendTokensValues) {
    setLoading(layoutDispatch, `${t("sending", { nameToDisplay: tokenToDisplay.denom })}`);

    try {
      const amountToTransfer = displayAmountToNative(amount, config.coinMap, tokenName);
      const nativeTokenToTransfer: Coin = { denom: tokenName, amount: amountToTransfer };
      const transferAmount: readonly Coin[] = [nativeTokenToTransfer];

      mutate({ recipientAddress, transferAmount });
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(layoutDispatch, false);
    }
  }

  const [integerAmountToDisplay, decimalAmountToDisplay] = tokenToDisplay.amount.split(".");

  const [decimalBalance, setDecimalBalance] = useState(Decimal.fromAtomics("0", 0));
  useEffect(() => {
    try {
      const decimalBalance = Decimal.fromAtomics(
        nativeToken.amount,
        config.coinMap[nativeToken.denom]?.fractionalDigits ?? 0,
      );
      setDecimalBalance(decimalBalance);
    } catch (error) {
      handleError(error);
    }
  }, [config.coinMap, handleError, nativeToken.amount, nativeToken.denom]);

  return (
    <OldPageLayout>
      <Stack gap="s4">
        <Title>{tokenToDisplay.denom}</Title>
        <TokenAmount>
          <Text>{`${integerAmountToDisplay}${decimalAmountToDisplay ? "." : ""}`}</Text>
          {decimalAmountToDisplay && <Text>{decimalAmountToDisplay}</Text>}
          <Text>{` ${t("tokens")}`}</Text>
        </TokenAmount>
        <FormSendTokens
          denomToDisplay={tokenToDisplay.denom}
          decimalBalance={decimalBalance}
          sendTokens={sendTokens}
        />
      </Stack>
    </OldPageLayout>
  );
}
