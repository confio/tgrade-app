import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { AllowanceInfo, CW20, Cw20Token, getCw20Token } from "utils/cw20";
import { AllowancesStack, Amount, MainStack, TitleAmountStack } from "./style";

const { Title, Text } = Typography;

interface ListParams {
  readonly contractAddress: string;
}

export default function List(): JSX.Element {
  const { url: pathAllowancesMatched } = useRouteMatch();
  const { contractAddress }: ListParams = useParams();
  const history = useHistory();
  const { handleError } = useError();
  const { getSigningClient, getAddress } = useSdk();
  const address = getAddress();

  const [allowances, setAllowances] = useState<readonly AllowanceInfo[]>([]);
  const [cw20Token, setCw20Token] = useState<Cw20Token>();

  useEffect(() => {
    let mounted = true;

    (async function updateCw20TokenAndAllowances() {
      const cw20Contract = CW20(getSigningClient()).use(contractAddress);
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
  }, [address, contractAddress, getSigningClient, handleError]);

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
    <PageLayout
      backButtonProps={{ path: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}` }}
    >
      <MainStack>
        <TitleAmountStack>
          <Title>Allowances</Title>
          <Amount>
            <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
            {amountDecimal && <Text>{amountDecimal}</Text>}
            <Text>{" Tokens"}</Text>
          </Amount>
          <Amount>
            <Text>{`${allowancesInteger}${allowancesDecimal ? "." : ""}`}</Text>
            {allowancesDecimal && <Text>{allowancesDecimal}</Text>}
            <Text>{" Allowances"}</Text>
          </Amount>
        </TitleAmountStack>
        <AllowancesStack>
          {allowances.map((allowanceInfo) => (
            <Button
              key={allowanceInfo.spender}
              data-size="large"
              type="primary"
              onClick={() => goToAllowanceDetail(allowanceInfo.spender)}
            >
              {allowanceInfo.spender}
            </Button>
          ))}
        </AllowancesStack>
        <Button type="primary" onClick={goToAllowancesAdd}>
          Add New
        </Button>
      </MainStack>
    </PageLayout>
  );
}
