import { Decimal } from "@cosmjs/math";
import { Button, Divider, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { CW20, Cw20Token, getCw20Token } from "utils/cw20";
import FormSearchAllowing from "./FormSearchAllowing";
import { Allowance, AllowanceStack, Amount, MainStack } from "./style";

const { Title, Text } = Typography;

interface DetailParams {
  readonly contractAddress: string;
  readonly allowingAddress?: string;
}

export default function Detail(): JSX.Element {
  const { url: pathTokenDetailMatched } = useRouteMatch();
  const { contractAddress, allowingAddress: allowingAddressParam }: DetailParams = useParams();
  const history = useHistory();
  const { handleError } = useError();
  const { getSigningClient, getAddress } = useSdk();
  const client = getSigningClient();
  const address = getAddress();

  const [allowingAddress, setAllowingAddress] = useState(allowingAddressParam);
  const [allowance, setAllowance] = useState<string>();
  const [cw20Token, setCw20Token] = useState<Cw20Token>();
  const [isUserMinter, setUserMinter] = useState(false);

  useEffect(() => {
    const cw20Contract = CW20(client).use(contractAddress);

    (async function updateCw20TokenAndAllowance() {
      const cw20Token = await getCw20Token(cw20Contract, address);
      if (!cw20Token) {
        handleError(new Error(`No CW20 token at address: ${contractAddress}`));
        return;
      }

      if (allowingAddress) {
        try {
          const { allowance: amount } = await cw20Contract.allowance(allowingAddress, address);
          setCw20Token({ ...cw20Token, amount });
          setAllowance(amount);
        } catch (error) {
          handleError(error);
        }
      } else {
        setCw20Token(cw20Token);
        setAllowance(undefined);
      }
    })();
  }, [address, allowingAddress, client, contractAddress, handleError]);

  useEffect(() => {
    const cw20Contract = CW20(client).use(contractAddress);

    (async function updateIsUserMinter() {
      try {
        const minterResponse = await cw20Contract.minter(address);
        if (minterResponse?.minter === address) {
          setUserMinter(true);
        } else {
          setUserMinter(false);
        }
      } catch (error) {
        handleError(error);
      }
    })();
  }, [address, client, contractAddress, handleError]);

  async function updateAllowance(allowingAddress?: string) {
    if (!allowingAddress) {
      setAllowingAddress(undefined);
      setAllowance(undefined);
      return;
    }

    setAllowingAddress(allowingAddress);
    const cw20contract = CW20(client).use(contractAddress);
    try {
      const { allowance } = await cw20contract.allowance(allowingAddress, address);
      setAllowance(allowance);
    } catch (error) {
      handleError(error);
    }
  }

  function goToSend() {
    history.push(`${pathTokenDetailMatched}${paths.cw20Wallet.send}`);
  }

  function goToAllowances() {
    history.push(`${pathTokenDetailMatched}${paths.cw20Wallet.allowances}`);
  }

  function goToMint() {
    history.push(`${pathTokenDetailMatched}${paths.cw20Wallet.mint}`);
  }

  const amountToDisplay = Decimal.fromAtomics(cw20Token?.amount || "0", cw20Token?.decimals ?? 0).toString();
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");

  const allowanceToDisplay = Decimal.fromAtomics(allowance || "0", cw20Token?.decimals ?? 0).toString();

  const showCurrentAllowance = !!allowance && allowance !== "0";
  const showSendButton = !allowance || allowance !== "0";
  const isSendButtonDisabled = !cw20Token || cw20Token.amount === "0";
  const showAllowancesLink = !allowingAddress;
  const showMintLink = isUserMinter;

  return (
    <PageLayout backButtonProps={{ path: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}` }}>
      <MainStack>
        <Title>{cw20Token?.symbol || ""}</Title>
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
        {showMintLink && (
          <Button type="primary" onClick={goToMint}>
            Mint tokens
          </Button>
        )}
      </MainStack>
    </PageLayout>
  );
}
