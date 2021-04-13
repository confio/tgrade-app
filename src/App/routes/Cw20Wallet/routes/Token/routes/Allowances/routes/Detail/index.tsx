import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { TokenAmount } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { setInitialLayoutState, setLoading, useError, useLayout, useSdk } from "service";
import { CW20, Cw20Token, getCw20Token } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { AddressText } from "./style";

const { Title, Text } = Typography;

interface DetailParams {
  readonly contractAddress: string;
  readonly spenderAddress: string;
}

export default function Detail(): JSX.Element {
  const { t } = useTranslation("cw20Wallet");

  const history = useHistory();
  const { url: pathAllowancesMatched } = useRouteMatch();
  const { contractAddress, spenderAddress }: DetailParams = useParams();
  const pathAllowances = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}${paths.cw20Wallet.allowances}`;

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathAllowances } }), [
    layoutDispatch,
    pathAllowances,
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
        handleError(new Error(t("error.noCw20Found", { contractAddress })));
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

  function goToAllowancesEdit() {
    history.push(`${pathAllowancesMatched}${paths.cw20Wallet.edit}`);
  }

  async function submitRemove() {
    setLoading(layoutDispatch, "Removing allowance...");
    const cw20Contract = CW20(signingClient).use(contractAddress);

    try {
      const { allowance } = await cw20Contract.allowance(address, spenderAddress);
      await cw20Contract.decreaseAllowance(address, spenderAddress, allowance);

      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("removeSuccess", { symbol: cw20Token?.symbol || "", spenderAddress }),
          customButtonText: t("allowances"),
          customButtonActionPath: pathAllowances,
        } as OperationResultState,
      });
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("removeFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathAllowancesMatched,
        } as OperationResultState,
      });
    }
  }

  const allowanceToDisplay = Decimal.fromAtomics(allowanceAmount || "0", cw20Token?.decimals ?? 0).toString();
  const [allowanceInteger, allowanceDecimal] = allowanceToDisplay.split(".");

  return (
    <Stack gap="s3">
      <Title>{`${cw20Token?.symbol || ""} ${t("allowance")}`}</Title>
      <TokenAmount>
        <Text>{`${allowanceInteger}${allowanceDecimal ? "." : ""}`}</Text>
        {allowanceDecimal && <Text>{allowanceDecimal}</Text>}
        <Text>{` ${t("tokens")}`}</Text>
      </TokenAmount>
      <AddressText>{spenderAddress}</AddressText>
      <Button type="primary" onClick={() => goToAllowancesEdit()}>
        {t("edit")}
      </Button>
      <Button type="primary" onClick={submitRemove}>
        {t("remove")}
      </Button>
    </Stack>
  );
}
