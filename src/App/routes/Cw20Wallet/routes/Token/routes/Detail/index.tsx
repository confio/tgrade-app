import { Decimal } from "@cosmjs/math";
import { Button, Divider, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useSdk } from "service";
import { CW20 } from "utils/cw20";
import FormSearchAllowing from "./FormSearchAllowing";
import { Allowance, AllowanceStack, Amount, MainStack } from "./style";

const { Title, Text } = Typography;

interface DetailParams {
  readonly contractAddress: string;
  readonly allowingAddress?: string;
}

export default function Detail(): JSX.Element {
  const { path: pathTokenDetailMatched } = useRouteMatch();
  const { contractAddress, allowingAddress: allowingAddressParam }: DetailParams = useParams();
  const history = useHistory();
  const { getSigningClient, getAddress } = useSdk();
  const address = getAddress();

  const [allowingAddress, setAllowingAddress] = useState(allowingAddressParam);
  const [allowance, setAllowance] = useState<string>();
  const [tokenName, setTokenName] = useState("");
  const [tokenAmount, setTokenAmount] = useState("0");
  const [fractionalDigits, setFractionalDigits] = useState(0);

  useEffect(() => {
    const cw20Contract = CW20(getSigningClient()).use(contractAddress);
    const tokenAddress = allowingAddress ?? address;

    cw20Contract.tokenInfo().then(({ symbol, decimals }) => {
      setTokenName(symbol);
      setFractionalDigits(decimals);
    });
    cw20Contract.balance(tokenAddress).then((balance) => setTokenAmount(balance));
  }, [getSigningClient, contractAddress, allowingAddress, address]);

  function updateAllowance(allowingAddress: string) {
    if (!allowingAddress) {
      setAllowingAddress(undefined);
      setAllowance(undefined);
      return;
    }

    setAllowingAddress(allowingAddress);

    const cw20contract = CW20(getSigningClient()).use(contractAddress);
    cw20contract.allowance(allowingAddress, address).then((response) => setAllowance(response.allowance));
  }

  function goToSend() {
    history.push(`${pathTokenDetailMatched}${paths.cw20Wallet.send}`);
  }

  function goToAllowances() {
    history.push(`${pathTokenDetailMatched}${paths.cw20Wallet.allowances}`);
  }

  const amountToDisplay = Decimal.fromAtomics(tokenAmount, fractionalDigits).toString();
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");

  const allowanceToDisplay = Decimal.fromAtomics(allowance ?? "0", fractionalDigits).toString();

  const showCurrentAllowance = !!allowance && allowance !== "0";
  const showSendButton = !allowance || allowance !== "0";
  const isSendButtonDisabled = tokenAmount === "0";
  const showAllowancesLink = !allowingAddress;

  return (
    <PageLayout backButtonProps={{ path: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}` }}>
      <MainStack>
        <Title>{tokenName}</Title>
        <Amount>
          <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
          {amountDecimal && <Text>{amountDecimal}</Text>}
          <Text>{" tokens"}</Text>
        </Amount>
        <FormSearchAllowing initialAddress={allowingAddress} setSearchedAddress={updateAllowance} />
        {showCurrentAllowance && (
          <AllowanceStack>
            <Divider />
            <Allowance>
              <Text>Your allowance</Text>
              <Text>{allowanceToDisplay}</Text>
            </Allowance>
          </AllowanceStack>
        )}
        {showSendButton && (
          <Button type="primary" onClick={goToSend} disabled={isSendButtonDisabled}>
            Send
          </Button>
        )}
        {showAllowancesLink && (
          <Button type="primary" onClick={goToAllowances}>
            My allowances
          </Button>
        )}
      </MainStack>
    </PageLayout>
  );
}
