import { Decimal } from "@cosmjs/math";
import { Typography } from "antd";
import { OldPageLayout, Stack } from "App/components/layout";
import { TokenAmount } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { setInitialLayoutState, setLoading, useError, useLayout, useSdk } from "service";
import { CW20, Cw20Token, getCw20Token } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import FormChangeAmount, { FormChangeAmountFields } from "./FormChangeAmount";
import { AddressText } from "./style";

const { Title, Text } = Typography;

interface EditParams {
  readonly contractAddress: string;
  readonly spenderAddress: string;
}

export default function Edit(): JSX.Element {
  const { t } = useTranslation("cw20Wallet");

  const history = useHistory();
  const { contractAddress, spenderAddress }: EditParams = useParams();
  const pathAllowance = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}${paths.cw20Wallet.allowances}/${spenderAddress}`;

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathAllowance } }), [
    layoutDispatch,
    pathAllowance,
  ]);

  const { handleError } = useError();
  const {
    sdkState: { signingClient, address },
  } = useSdk();

  const [cw20Token, setCw20Token] = useState<Cw20Token>();
  const [allowanceAmount, setAllowanceAmount] = useState("0");

  useEffect(() => {
    let mounted = true;
    const cw20Contract = CW20(signingClient).use(contractAddress);

    (async function updateCw20TokenAndAllowance() {
      const cw20Token = await getCw20Token(cw20Contract, address);
      if (!cw20Token) {
        handleError(new Error(`No CW20 token at address: ${contractAddress}`));
        return;
      }

      if (mounted) setCw20Token(cw20Token);
      const { allowance } = await cw20Contract.allowance(address, spenderAddress);
      if (mounted) setAllowanceAmount(allowance);
    })();

    return () => {
      mounted = false;
    };
  }, [address, contractAddress, handleError, signingClient, spenderAddress, t]);

  async function submitChangeAmount(values: FormChangeAmountFields): Promise<void> {
    setLoading(layoutDispatch, `${t("editing")}`);

    const { amount: newAmount } = values;
    const cw20Contract = CW20(signingClient).use(contractAddress);

    try {
      const decNewAmount = Decimal.fromUserInput(newAmount, cw20Token?.decimals ?? 0);
      const decCurrentAmount = Decimal.fromAtomics(allowanceAmount, cw20Token?.decimals ?? 0);

      if (decNewAmount.isGreaterThan(decCurrentAmount)) {
        await cw20Contract.increaseAllowance(
          address,
          spenderAddress,
          decNewAmount.minus(decCurrentAmount).atomics,
        );
      } else {
        await cw20Contract.decreaseAllowance(
          address,
          spenderAddress,
          decCurrentAmount.minus(decNewAmount).atomics,
        );
      }

      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("editSuccess", { symbol: cw20Token?.symbol || "", newAmount, spenderAddress }),
          customButtonText: t("allowances"),
          customButtonActionPath: pathAllowance,
        } as OperationResultState,
      });
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("editFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathAllowance,
        } as OperationResultState,
      });
    }
  }

  const amountToDisplay = Decimal.fromAtomics(cw20Token?.amount || "0", cw20Token?.decimals ?? 0).toString();
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");
  const allowanceToDisplay = Decimal.fromAtomics(allowanceAmount || "0", cw20Token?.decimals ?? 0).toString();
  const [allowanceInteger, allowanceDecimal] = allowanceToDisplay.split(".");

  return (
    <OldPageLayout>
      <Stack gap="s3">
        <Title>{t("editAllowance")}</Title>
        <AddressText>{spenderAddress}</AddressText>
        <TokenAmount>
          <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
          {amountDecimal && <Text>{amountDecimal}</Text>}
          <Text>{` ${t("tokens")}`}</Text>
        </TokenAmount>
        <TokenAmount>
          <Text>{`${allowanceInteger}${allowanceDecimal ? "." : ""}`}</Text>
          {allowanceDecimal && <Text>{allowanceDecimal}</Text>}
          <Text>{` ${t("allowance")}`}</Text>
        </TokenAmount>
        <FormChangeAmount tokenName={cw20Token?.symbol || ""} submitChangeAmount={submitChangeAmount} />
      </Stack>
    </OldPageLayout>
  );
}
