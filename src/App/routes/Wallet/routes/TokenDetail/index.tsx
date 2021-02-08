import { Coin } from "@cosmjs/launchpad";
import { isBroadcastTxFailure } from "@cosmjs/stargate";
import { Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { Loading } from "App/components/logic";
import { pathOperationResult, pathTokens, pathWallet } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { displayAmountToNative, nativeCoinToDisplay, useBalance } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { FormSendTokens, FormSendTokensValues } from "./FormSendTokens";
import { Amount, MainStack } from "./style";

const { Title, Text } = Typography;

interface TokenDetailParams {
  readonly tokenName: string;
}

export default function TokenDetail(): JSX.Element {
  const [loading, setLoading] = useState(false);

  const { handleError } = useError();
  const history = useHistory();
  const { url } = useRouteMatch();
  const { tokenName }: TokenDetailParams = useParams();
  const [tokenAmount, setTokenAmount] = useState("0");

  const { getConfig, getClient, getAddress } = useSdk();
  const balance = useBalance();
  const config = getConfig();

  useEffect(() => {
    (async function updateTokenAmount(): Promise<void> {
      try {
        const coin = balance.find((coin) => coin.denom === tokenName);
        const amount = coin?.amount ?? "0";
        setTokenAmount(amount);
      } catch (error) {
        setTokenAmount("0");
        handleError(error);
      }
    })();
  }, [balance, handleError, tokenName]);

  async function sendTokensAction(values: FormSendTokensValues): Promise<void> {
    setLoading(true);
    const { address: recipientAddress, amount } = values;

    try {
      const amountToTransfer = displayAmountToNative(amount, config.coinMap, tokenName);
      const nativeTokenToTransfer: Coin = { denom: tokenName, amount: amountToTransfer };
      const transferAmount: readonly Coin[] = [nativeTokenToTransfer];

      const response = await getClient().sendTokens(getAddress(), recipientAddress, transferAmount);
      if (isBroadcastTxFailure(response)) {
        throw new Error(response.rawLog);
      }

      history.push({
        pathname: pathOperationResult,
        state: {
          success: true,
          message: `${amount} ${config.coinMap[tokenName].denom} successfully sent to ${recipientAddress}`,
          customButtonText: "Tokens",
          customButtonActionPath: `${pathWallet}${pathTokens}`,
        } as OperationResultState,
      });
    } catch (stackTrace) {
      handleError(stackTrace);

      history.push({
        pathname: pathOperationResult,
        state: {
          success: false,
          message: "Send transaction failed:",
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: url,
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
    <PageLayout backButtonProps={{ path: `${pathWallet}${pathTokens}` }}>
      <MainStack>
        <Title>{nameToDisplay}</Title>
        <Amount>
          <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
          {amountDecimal && <Text>{amountDecimal}</Text>}
          <Text>{" Tokens"}</Text>
        </Amount>
        <FormSendTokens
          tokenName={nameToDisplay}
          tokenAmount={amountToDisplay}
          sendTokensAction={sendTokensAction}
        />
      </MainStack>
    </PageLayout>
  );
}
