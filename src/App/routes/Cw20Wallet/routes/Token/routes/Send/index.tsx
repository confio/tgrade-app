import { Decimal } from "@cosmjs/math";
import { Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { Loading } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { CW20 } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import FormSendTokens, { FormSendTokensFields } from "./FormSendTokens";
import { Amount, MainStack } from "./style";

const { Title, Text } = Typography;

interface SendParams {
  readonly contractAddress: string;
  readonly allowingAddress?: string;
}

export default function Send(): JSX.Element {
  const [loading, setLoading] = useState(false);

  const { contractAddress, allowingAddress }: SendParams = useParams();
  const pathTokenDetail = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}/${
    allowingAddress ?? ""
  }`;
  const history = useHistory();
  const { handleError } = useError();
  const { getSigningClient, getAddress } = useSdk();
  const address = getAddress();

  const [tokenName, setTokenName] = useState("");
  const [tokenAmount, setTokenAmount] = useState("0");
  const [tokenDecimals, setTokenDecimals] = useState(0);

  useEffect(() => {
    const cw20Contract = CW20(getSigningClient()).use(contractAddress);
    const tokenAddress = allowingAddress ?? address;

    cw20Contract.tokenInfo().then(({ symbol, decimals }) => {
      setTokenName(symbol);
      setTokenDecimals(decimals);
    });

    if (allowingAddress) {
      cw20Contract.allowance(allowingAddress, address).then((response) => setTokenAmount(response.allowance));
    } else {
      cw20Contract.balance(tokenAddress).then((balance) => setTokenAmount(balance));
    }
  }, [getSigningClient, contractAddress, allowingAddress, address]);

  const sendTokensAction = (values: FormSendTokensFields) => {
    setLoading(true);

    const { address: recipientAddress, amount } = values;
    const transferAmount = Decimal.fromUserInput(amount, tokenDecimals).atomics;

    const cw20Contract = CW20(getSigningClient()).use(contractAddress);

    try {
      if (allowingAddress) {
        cw20Contract
          .transferFrom(address, allowingAddress, recipientAddress, transferAmount)
          .then((txHash) => {
            if (!txHash) {
              return Promise.reject("Transfer from failed");
            }

            return history.push({
              pathname: paths.operationResult,
              state: {
                success: true,
                message: `${amount} ${tokenName} successfully sent to ${recipientAddress} with allowance from ${allowingAddress}`,
                customButtonText: "Token detail",
                customButtonActionPath: pathTokenDetail,
              } as OperationResultState,
            });
          });
      } else {
        cw20Contract.transfer(address, recipientAddress, transferAmount).then((txHash) => {
          if (!txHash) {
            return Promise.reject("Transfer failed");
          }

          return history.push({
            pathname: paths.operationResult,
            state: {
              success: true,
              message: `${amount} ${tokenName} successfully sent to ${recipientAddress}`,
              customButtonText: "Token detail",
              customButtonActionPath: pathTokenDetail,
            } as OperationResultState,
          });
        });
      }
    } catch (stackTrace) {
      handleError(stackTrace);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: "Send transaction failed:",
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathTokenDetail,
        } as OperationResultState,
      });
    }
  };

  const amountToDisplay = Decimal.fromAtomics(tokenAmount, tokenDecimals).toString();
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");

  const maxAmount = Decimal.fromAtomics(tokenAmount, tokenDecimals);

  return loading ? (
    <Loading loadingText={`Sending ${tokenName}...`} />
  ) : (
    <PageLayout backButtonProps={{ path: pathTokenDetail }}>
      <MainStack>
        <Title>{tokenName}</Title>
        <Amount>
          <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
          {amountDecimal && <Text>{amountDecimal}</Text>}
          <Text>{" tokens"}</Text>
        </Amount>
        <FormSendTokens tokenName={tokenName} maxAmount={maxAmount} sendTokensAction={sendTokensAction} />
      </MainStack>
    </PageLayout>
  );
}
