import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { PageLayout, Stack } from "App/components/layout";
import { TokenAmount } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { CW20, Cw20Token, getCw20Token } from "utils/cw20";
import FormSearchAllowing from "./FormSearchAllowing";

const { Title, Text } = Typography;

interface DetailParams {
  readonly contractAddress: string;
  readonly allowingAddress?: string;
}

export default function Detail(): JSX.Element {
  const { contractAddress, allowingAddress: allowingAddressParam }: DetailParams = useParams();
  const pathTokenDetail = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}`;
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
    let mounted = true;
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
          if (mounted) setCw20Token(cw20Token);
          if (mounted) setAllowance(amount);
        } catch (error) {
          handleError(error);
        }
      } else {
        if (mounted) setCw20Token(cw20Token);
        if (mounted) setAllowance(undefined);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [address, allowingAddress, client, contractAddress, handleError]);

  useEffect(() => {
    let mounted = true;
    const cw20Contract = CW20(client).use(contractAddress);

    (async function updateIsUserMinter() {
      try {
        const minterResponse = await cw20Contract.minter(address);
        if (minterResponse?.minter === address) {
          if (mounted) setUserMinter(true);
        } else {
          if (mounted) setUserMinter(false);
        }
      } catch (error) {
        handleError(error);
      }
    })();

    return () => {
      mounted = false;
    };
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
    const paramAllowing = allowingAddress ? `/${allowingAddress}` : "";
    history.push(`${pathTokenDetail}${paramAllowing}${paths.cw20Wallet.send}`);
  }

  function goToAllowances() {
    history.push(`${pathTokenDetail}${paths.cw20Wallet.allowances}`);
  }

  function goToMint() {
    history.push(`${pathTokenDetail}${paths.cw20Wallet.mint}`);
  }

  const amountToDisplay = Decimal.fromAtomics(cw20Token?.amount || "0", cw20Token?.decimals ?? 0).toString();
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");
  const allowanceToDisplay = Decimal.fromAtomics(allowance || "0", cw20Token?.decimals ?? 0).toString();
  const [allowanceInteger, allowanceDecimal] = allowanceToDisplay.split(".");
  const isSendButtonDisabled = allowance ? allowance === "0" : cw20Token?.amount === "0";

  return (
    <PageLayout backButtonProps={{ path: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}` }}>
      <Stack gap="s4">
        <Title>{cw20Token?.symbol || ""}</Title>
        <Stack gap="s-2">
          <TokenAmount>
            <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
            {amountDecimal && <Text>{amountDecimal}</Text>}
            <Text>{" Tokens"}</Text>
          </TokenAmount>
          {allowance ? (
            <TokenAmount>
              <Text>{`${allowanceInteger}${allowanceDecimal ? "." : ""}`}</Text>
              {allowanceDecimal && <Text>{allowanceDecimal}</Text>}
              <Text>{" Allowance"}</Text>
            </TokenAmount>
          ) : null}
        </Stack>
        <Stack>
          <Button type="primary" onClick={goToSend} disabled={isSendButtonDisabled}>
            Send Tokens
          </Button>
          {!allowingAddress && isUserMinter ? (
            <Button type="primary" onClick={goToMint}>
              Mint Tokens
            </Button>
          ) : null}
          {!allowingAddress ? (
            <Button type="primary" onClick={goToAllowances}>
              My Allowances
            </Button>
          ) : null}
        </Stack>
        <FormSearchAllowing initialAddress={allowingAddress} setSearchedAddress={updateAllowance} />
        {allowingAddress ? (
          <Button type="default" onClick={() => updateAllowance()}>
            Back to My Account
          </Button>
        ) : null}
      </Stack>
    </PageLayout>
  );
}
