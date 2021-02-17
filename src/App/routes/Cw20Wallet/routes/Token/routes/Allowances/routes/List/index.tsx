import { Decimal } from "@cosmjs/math";
import { Button, Divider, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { Fragment, useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { AllowanceInfo, CW20, Cw20Token, getCw20Token } from "utils/cw20";
import editIcon from "./assets/edit.svg";
import {
  AllowanceAmountCopy,
  AllowanceItem,
  AllowancesStack,
  Amount,
  MainStack,
  TitleAmountStack,
} from "./style";

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
    (async function updateCw20TokenAndAllowances() {
      const cw20Contract = CW20(getSigningClient()).use(contractAddress);
      const cw20Token = await getCw20Token(cw20Contract, address);
      if (!cw20Token) {
        handleError(new Error(`No CW20 token at address: ${contractAddress}`));
        return;
      }

      setCw20Token(cw20Token);

      try {
        const allowances = await cw20Contract.allAllowances(address);
        setAllowances(allowances);
      } catch (error) {
        handleError(error);
      }
    })();
  }, [address, contractAddress, getSigningClient, handleError]);

  function goToAllowancesEdit(spenderAddress: string) {
    history.push(`${pathAllowancesMatched}${paths.cw20Wallet.edit}/${spenderAddress}`);
  }

  function goToAllowancesAdd() {
    history.push(`${pathAllowancesMatched}${paths.cw20Wallet.add}`);
  }

  const amountToDisplay = Decimal.fromAtomics(cw20Token?.amount || "0", cw20Token?.decimals ?? 0).toString();
  const [amountInteger, maybeAmountDecimal] = amountToDisplay.split(".");
  const amountDecimal = maybeAmountDecimal ?? "";

  return (
    <PageLayout
      backButtonProps={{ path: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}` }}
    >
      <MainStack>
        <TitleAmountStack>
          <Title>Allowances</Title>
          <Amount>
            <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
            <Text>
              {amountDecimal} {cw20Token?.symbol || ""}
            </Text>
            <Text>{" tokens"}</Text>
          </Amount>
        </TitleAmountStack>
        <AllowancesStack>
          {allowances.map((allowanceInfo, index) => {
            const allowanceToDisplay = Decimal.fromAtomics(
              allowanceInfo.allowance,
              cw20Token?.decimals ?? 0,
            ).toString();

            return (
              <Fragment key={allowanceInfo.spender}>
                {index > 0 && <Divider />}
                <AllowanceItem>
                  <Text>{allowanceInfo.spender}</Text>
                  <AllowanceAmountCopy>
                    <Text>{allowanceToDisplay}</Text>
                    <img
                      alt="Edit allowance"
                      src={editIcon}
                      onClick={() => goToAllowancesEdit(allowanceInfo.spender)}
                    />
                  </AllowanceAmountCopy>
                </AllowanceItem>
              </Fragment>
            );
          })}
        </AllowancesStack>
        <Button type="primary" onClick={goToAllowancesAdd}>
          Add New
        </Button>
      </MainStack>
    </PageLayout>
  );
}
