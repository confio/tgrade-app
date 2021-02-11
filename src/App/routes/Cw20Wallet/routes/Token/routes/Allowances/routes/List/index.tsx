import { Decimal } from "@cosmjs/math";
import { Button, Divider, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useSdk } from "service";
import { AllowanceInfo, CW20 } from "utils/cw20";
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
  const { path: pathAllowancesMatched } = useRouteMatch();
  const { contractAddress }: ListParams = useParams();
  const history = useHistory();
  const { getSigningClient, getAddress } = useSdk();
  const address = getAddress();

  const [allowances, setAllowances] = useState<readonly AllowanceInfo[]>([]);
  const [tokenName, setTokenName] = useState("");
  const [tokenAmount, setTokenAmount] = useState("0");
  const [fractionalDigits, setFractionalDigits] = useState(0);

  useEffect(() => {
    const cw20Contract = CW20(getSigningClient()).use(contractAddress);

    cw20Contract.tokenInfo().then(({ symbol, decimals }) => {
      setTokenName(symbol);
      setFractionalDigits(decimals);
    });
    cw20Contract.balance(address).then((balance) => setTokenAmount(balance));
    cw20Contract.allAllowances(address).then(({ allowances }) => setAllowances(allowances));
  }, [getSigningClient, contractAddress, address]);

  function goToAllowancesEdit(spenderAddress: string) {
    history.push(`${pathAllowancesMatched}${paths.cw20Wallet.edit}/${spenderAddress}`);
  }

  function goToAllowancesAdd() {
    history.push(`${pathAllowancesMatched}${paths.cw20Wallet.add}`);
  }

  const amountToDisplay = Decimal.fromAtomics(tokenAmount, fractionalDigits).toString();
  const [amountInteger, maybeAmountDecimal] = amountToDisplay.split(".");
  const amountDecimal = maybeAmountDecimal ?? "";

  return (
    <PageLayout
      backButtonProps={{ path: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}${contractAddress}` }}
    >
      <MainStack>
        <TitleAmountStack>
          <Title>Allowances</Title>
          <Amount>
            <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
            <Text>
              {amountDecimal} {tokenName}
            </Text>
            <Text>{" tokens"}</Text>
          </Amount>
        </TitleAmountStack>
        <AllowancesStack>
          {allowances.map((allowanceInfo, index) => {
            const allowanceToDisplay = Decimal.fromAtomics(
              allowanceInfo.allowance,
              fractionalDigits,
            ).toString();

            return (
              <>
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
              </>
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
