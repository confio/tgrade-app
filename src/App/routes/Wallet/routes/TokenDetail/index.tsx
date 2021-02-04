import { Coin } from "@cosmjs/launchpad";
import { isBroadcastTxFailure } from "@cosmjs/stargate";
import { Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { BackButton, Loading } from "App/components/logic";
import { pathOperationResult, pathTokens, pathWallet } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import React, { useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useSdk } from "service";
import { displayAmountToNative, nativeCoinToDisplay } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { FormSendTokens, FormSendTokensValues } from "./FormSendTokens";
import { Amount, MainStack } from "./style";

const { Title, Text } = Typography;

interface TokenDetailParams {
  readonly tokenName: string;
}

export interface TokenDetailState {
  readonly tokenAmount: string;
}

export default function TokenDetail(): JSX.Element {
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { path } = useRouteMatch();
  const { tokenName }: TokenDetailParams = useParams();
  const { tokenAmount } = history.location.state as TokenDetailState;

  const { getConfig, getClient, getAddress, refreshBalance } = useSdk();
  const config = getConfig();

  const sendTokensAction = (values: FormSendTokensValues) => {
    setLoading(true);
    const { address: recipientAddress, amount } = values;

    // TODO: Add try catch so it does not fail i.e. too many decimals
    const amountToTransfer = displayAmountToNative(amount, config.coinMap, tokenName);

    const nativeTokenToTransfer: Coin = { denom: tokenName, amount: amountToTransfer };
    const transferAmount: readonly Coin[] = [nativeTokenToTransfer];

    getClient()
      .sendTokens(getAddress(), recipientAddress, transferAmount)
      .then((result) => {
        if (isBroadcastTxFailure(result)) {
          Promise.reject(result.rawLog);
        }

        refreshBalance();

        history.push({
          pathname: pathOperationResult,
          state: {
            success: true,
            message: `${amount} ${tokenName} successfully sent to ${recipientAddress}`,
            customButtonText: "Tokens",
            customButtonActionPath: `${pathWallet}${pathTokens}`,
          } as OperationResultState,
        });
      })
      .catch((stackTrace) => {
        console.error(stackTrace);

        const tokenDetailState: TokenDetailState = { tokenAmount };

        history.push({
          pathname: pathOperationResult,
          state: {
            success: false,
            message: "Send transaction failed:",
            error: getErrorFromStackTrace(stackTrace),
            customButtonActionPath: path,
            customButtonActionState: tokenDetailState,
          } as OperationResultState,
        });
      });
  };

  const nativeToken: Coin = { denom: tokenName, amount: tokenAmount };
  // TODO: Add try catch so it does not fail i.e. too many decimals
  const { denom: nameToDisplay, amount: amountToDisplay } = nativeCoinToDisplay(nativeToken, config.coinMap);
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");

  return loading ? (
    <Loading loadingText={`Sending ${nameToDisplay}...`} />
  ) : (
    <PageLayout>
      <MainStack>
        <BackButton path={`${pathWallet}${pathTokens}`} />
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
