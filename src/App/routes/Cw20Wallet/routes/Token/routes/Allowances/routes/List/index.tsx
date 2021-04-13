import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { NavPagination, pageSize, TokenAmount } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { setInitialLayoutState, useError, useLayout, useSdk } from "service";
import { AllowanceInfo, CW20, Cw20Token, getCw20Token } from "utils/cw20";
import { AllowanceButton } from "./style";

const { Title, Text } = Typography;

interface ListParams {
  readonly contractAddress: string;
}

export default function List(): JSX.Element {
  const { t } = useTranslation("cw20Wallet");

  const history = useHistory();
  const { url: pathAllowancesMatched } = useRouteMatch();
  const { contractAddress }: ListParams = useParams();
  const pathTokenDetail = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}`;

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathTokenDetail } }), [
    layoutDispatch,
    pathTokenDetail,
  ]);

  const { handleError } = useError();
  const {
    sdkState: { signingClient, address },
  } = useSdk();

  const [allowances, setAllowances] = useState<readonly AllowanceInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cw20Token, setCw20Token] = useState<Cw20Token>();

  useEffect(() => {
    let mounted = true;

    (async function updateCw20TokenAndAllowances() {
      const cw20Contract = CW20(signingClient).use(contractAddress);
      const cw20Token = await getCw20Token(cw20Contract, address);
      if (!cw20Token) {
        handleError(new Error(`No CW20 token at address: ${contractAddress}`));
        return;
      }

      if (mounted) setCw20Token(cw20Token);

      try {
        const allowances = await cw20Contract.allAllowances(address);
        if (mounted) setAllowances(allowances);
      } catch (error) {
        handleError(error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [address, contractAddress, handleError, signingClient, t]);

  function goToAllowanceDetail(spenderAddress: string) {
    history.push(`${pathAllowancesMatched}/${spenderAddress}`);
  }

  function goToAllowancesAdd() {
    history.push(`${pathAllowancesMatched}${paths.cw20Wallet.add}`);
  }

  const amountToDisplay = Decimal.fromAtomics(cw20Token?.amount || "0", cw20Token?.decimals ?? 0).toString();
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");

  const allowancesToDisplay = allowances
    .map(({ allowance }) => Decimal.fromAtomics(allowance, cw20Token?.decimals ?? 0))
    .reduce(
      (accumulator, currentValue) => accumulator.plus(currentValue),
      Decimal.fromAtomics("0", cw20Token?.decimals ?? 0),
    )
    .toString();
  const [allowancesInteger, allowancesDecimal] = allowancesToDisplay.split(".");

  return (
    <Stack gap="s7">
      <Stack gap="s2">
        <Title>{t("allowances")}</Title>
        <TokenAmount>
          <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
          {amountDecimal && <Text>{amountDecimal}</Text>}
          <Text>{` ${t("tokens")}`}</Text>
        </TokenAmount>
        <TokenAmount>
          <Text>{`${allowancesInteger}${allowancesDecimal ? "." : ""}`}</Text>
          {allowancesDecimal && <Text>{allowancesDecimal}</Text>}
          <Text>{` ${t("allowance")}`}</Text>
        </TokenAmount>
      </Stack>
      <NavPagination currentPage={currentPage} setCurrentPage={setCurrentPage} total={allowances.length} />
      {allowances.length ? (
        <Stack>
          {allowances.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((allowanceInfo) => (
            <AllowanceButton
              key={allowanceInfo.spender}
              data-size="large"
              type="primary"
              onClick={() => goToAllowanceDetail(allowanceInfo.spender)}
            >
              {allowanceInfo.spender}
            </AllowanceButton>
          ))}
        </Stack>
      ) : null}
      <Button type="primary" onClick={goToAllowancesAdd}>
        {t("addNew")}
      </Button>
    </Stack>
  );
}
