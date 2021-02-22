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
import { CW20, Cw20Token, getCw20Token } from "utils/cw20";
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
  const pathTokenDetail = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}${
    allowingAddress ? `/${allowingAddress}` : ""
  }`;
  const history = useHistory();
  const { handleError } = useError();
  const { getSigningClient, getAddress } = useSdk();
  const client = getSigningClient();
  const address = getAddress();

  const [cw20Token, setCw20Token] = useState<Cw20Token>();

  useEffect(() => {
    let mounted = true;
    const cw20Contract = CW20(client).use(contractAddress);

    (async function updateCw20Token() {
      const cw20Token = await getCw20Token(cw20Contract, address);
      if (!cw20Token) {
        handleError(new Error(`No CW20 token at address: ${contractAddress}`));
        return;
      }

      if (allowingAddress) {
        try {
          const { allowance: amount } = await cw20Contract.allowance(allowingAddress, address);
          if (mounted) setCw20Token({ ...cw20Token, amount });
        } catch (error) {
          handleError(error);
        }
      } else {
        if (mounted) setCw20Token(cw20Token);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [address, allowingAddress, client, contractAddress, handleError]);

  async function sendTokensAction(values: FormSendTokensFields) {
    if (!cw20Token) return;
    setLoading(true);

    const { address: recipientAddress, amount } = values;
    const cw20Contract = CW20(client).use(contractAddress);

    try {
      const transferAmount = Decimal.fromUserInput(amount, cw20Token.decimals).atomics;

      if (allowingAddress) {
        await cw20Contract.transferFrom(address, allowingAddress, recipientAddress, transferAmount);

        history.push({
          pathname: paths.operationResult,
          state: {
            success: true,
            message: `${amount} ${cw20Token.symbol} successfully sent to ${recipientAddress} with allowance from ${allowingAddress}`,
            customButtonText: "Token detail",
            customButtonActionPath: pathTokenDetail,
          } as OperationResultState,
        });
      } else {
        const response = await cw20Contract.transfer(address, recipientAddress, transferAmount);
        if (!response) {
          throw new Error(`Transfer failed`);
        }

        history.push({
          pathname: paths.operationResult,
          state: {
            success: true,
            message: `${amount} ${cw20Token.symbol} successfully sent to ${recipientAddress}`,
            customButtonText: "Token detail",
            customButtonActionPath: pathTokenDetail,
          } as OperationResultState,
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
  }

  const amountToDisplay = Decimal.fromAtomics(cw20Token?.amount || "0", cw20Token?.decimals ?? 0).toString();
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");

  const maxAmount = Decimal.fromAtomics(cw20Token?.amount || "0", cw20Token?.decimals ?? 0);

  return loading ? (
    <Loading loadingText={`Sending ${cw20Token?.symbol || ""}...`} />
  ) : (
    <PageLayout backButtonProps={{ path: pathTokenDetail }}>
      <MainStack>
        <Title>{cw20Token?.symbol || ""}</Title>
        <Amount>
          <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
          {amountDecimal && <Text>{amountDecimal}</Text>}
          <Text>{" tokens"}</Text>
        </Amount>
        <FormSendTokens
          tokenName={cw20Token?.symbol || ""}
          maxAmount={maxAmount}
          sendTokensAction={sendTokensAction}
        />
      </MainStack>
    </PageLayout>
  );
}
