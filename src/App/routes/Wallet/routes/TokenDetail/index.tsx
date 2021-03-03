import { Coin } from "@cosmjs/launchpad";
import { isBroadcastTxFailure } from "@cosmjs/stargate";
import { Typography } from "antd";
import { PageLayout, Stack } from "App/components/layout";
import { Loading } from "App/components/logic";
import TokenAmount from "App/components/logic/TokenAmount";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { displayAmountToNative, nativeCoinToDisplay, useBalance } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import FormSendTokens, { FormSendTokensValues } from "./FormSendTokens";

const { Title, Text } = Typography;

interface TokenDetailParams {
  readonly tokenName: string;
}

export default function TokenDetail(): JSX.Element {
  const [loading, setLoading] = useState(false);

  const { handleError } = useError();
  const history = useHistory();
  const { url: pathTokenDetailMatched } = useRouteMatch();
  const { tokenName }: TokenDetailParams = useParams();
  const [tokenAmount, setTokenAmount] = useState("0");

  const { getConfig, getAddress, getSigningClient } = useSdk();
  const balance = useBalance();
  const config = getConfig();

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
    setLoading(true);
    const { address: recipientAddress, amount } = values;

    try {
      const amountToTransfer = displayAmountToNative(amount, config.coinMap, tokenName);
      const nativeTokenToTransfer: Coin = { denom: tokenName, amount: amountToTransfer };
      const transferAmount: readonly Coin[] = [nativeTokenToTransfer];

      const response = await getSigningClient().sendTokens(getAddress(), recipientAddress, transferAmount);
      if (isBroadcastTxFailure(response)) {
        throw new Error(response.rawLog);
      }

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: `${amount} ${config.coinMap[tokenName].denom} successfully sent to ${recipientAddress}`,
          customButtonText: "Tokens",
          customButtonActionPath: `${paths.wallet.prefix}${paths.wallet.tokens}`,
        } as OperationResultState,
      });
    } catch (stackTrace) {
      handleError(stackTrace);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: "Send transaction failed:",
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

  return loading ? (
    <Loading loadingText={`Sending ${nameToDisplay}...`} />
  ) : (
    <PageLayout backButtonProps={{ path: `${paths.wallet.prefix}${paths.wallet.tokens}` }}>
      <Stack gap="s4">
        <Title>{nameToDisplay}</Title>
        <TokenAmount>
          <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
          {amountDecimal && <Text>{amountDecimal}</Text>}
          <Text>{" Tokens"}</Text>
        </TokenAmount>
        <FormSendTokens
          tokenName={nameToDisplay}
          tokenAmount={amountToDisplay}
          sendTokensAction={sendTokensAction}
        />
      </Stack>
    </PageLayout>
  );
}
