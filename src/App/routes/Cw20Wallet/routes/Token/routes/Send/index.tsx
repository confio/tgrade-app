import { Decimal } from "@cosmjs/math";
import { Typography } from "antd";
import { Stack } from "App/components/layout";
import { TokenAmount } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { useLayout } from "service/layout";
import { CW20, Cw20Token, getCw20Token } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import FormSendTokens, { FormSendTokensFields } from "./FormSendTokens";

const { Title, Text } = Typography;

interface SendParams {
  readonly contractAddress: string;
  readonly allowingAddress?: string;
}

export default function Send(): JSX.Element {
  const { t } = useTranslation("cw20Wallet");
  const history = useHistory();
  const { contractAddress, allowingAddress }: SendParams = useParams();
  const pathTokenDetail = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}${
    allowingAddress ? `/${allowingAddress}` : ""
  }`;
  const backButtonProps = useMemo(() => ({ path: pathTokenDetail }), [pathTokenDetail]);
  const { setLoading } = useLayout({ backButtonProps });

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
        handleError(new Error(t("error.noCw20Found", { contractAddress })));
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
  }, [address, allowingAddress, client, contractAddress, handleError, t]);

  async function sendTokensAction(values: FormSendTokensFields) {
    if (!cw20Token) return;
    setLoading(`Sending ${cw20Token.symbol}...`);

    const { address: recipientAddress, amount } = values;
    const cw20Contract = CW20(client).use(contractAddress);
    const symbol = cw20Token.symbol;

    try {
      const transferAmount = Decimal.fromUserInput(amount, cw20Token.decimals).atomics;

      if (allowingAddress) {
        await cw20Contract.transferFrom(address, allowingAddress, recipientAddress, transferAmount);

        history.push({
          pathname: paths.operationResult,
          state: {
            success: true,
            message: t("transferSuccess", { amount, symbol, recipientAddress, allowingAddress }),
            customButtonText: t("tokenDetail"),
            customButtonActionPath: pathTokenDetail,
          } as OperationResultState,
        });
      } else {
        const response = await cw20Contract.transfer(address, recipientAddress, transferAmount);
        if (!response) {
          throw new Error(t("transferFail"));
        }

        setLoading(false);

        history.push({
          pathname: paths.operationResult,
          state: {
            success: true,
            message: t("sendSuccess", { amount, symbol, recipientAddress }),
            customButtonText: t("tokenDetail"),
            customButtonActionPath: pathTokenDetail,
          } as OperationResultState,
        });
      }
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("sendSuccess"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathTokenDetail,
        } as OperationResultState,
      });
    }
  }

  const amountToDisplay = Decimal.fromAtomics(cw20Token?.amount || "0", cw20Token?.decimals ?? 0).toString();
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");

  const maxAmount = Decimal.fromAtomics(cw20Token?.amount || "0", cw20Token?.decimals ?? 0);

  return (
    <Stack gap="s4">
      <Title>{cw20Token?.symbol || ""}</Title>
      <TokenAmount>
        <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
        {amountDecimal && <Text>{amountDecimal}</Text>}
        <Text>{` ${t("tokens")}`}</Text>
      </TokenAmount>
      <FormSendTokens
        tokenName={cw20Token?.symbol || ""}
        maxAmount={maxAmount}
        sendTokensAction={sendTokensAction}
      />
    </Stack>
  );
}
