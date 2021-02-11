import { Coin } from "@cosmjs/launchpad";
import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useContracts, useSdk } from "service";
import { CW20, CW20Instance } from "utils/cw20";
import { MainStack, TokenItem, TokenStack } from "./style";

const { Text, Title } = Typography;

interface TokenData {
  readonly coin: Coin;
  readonly fractionalDigits: number;
  readonly address: string;
}

async function getTokenData(contract: CW20Instance, address: string): Promise<TokenData> {
  try {
    const { symbol: denom, decimals: fractionalDigits } = await contract.tokenInfo();
    const amount = await contract.balance(address);
    return { coin: { denom, amount }, fractionalDigits, address: contract.contractAddress };
  } catch (error) {
    // If no tokenInfo, or no balance, return dummy data to be filtered
    return { coin: { denom: "", amount: "" }, fractionalDigits: 0, address: "" };
  }
}

function tokenCompare(a: TokenData, b: TokenData) {
  if (a.coin.denom < b.coin.denom) {
    return -1;
  }
  if (a.coin.denom > b.coin.denom) {
    return 1;
  }
  return 0;
}

export default function TokensList(): JSX.Element {
  const history = useHistory();
  const { getConfig, getSigningClient, getAddress } = useSdk();
  const config = getConfig();
  const { contracts: cw20Contracts, addContract } = useContracts();
  const { path: pathTokensMatched } = useRouteMatch();

  const [tokens, setTokens] = useState<readonly TokenData[]>([]);

  useEffect(() => {
    if (!config.codeId) return;
    const client = getSigningClient();

    client.getContracts(config.codeId).then((contracts) => {
      contracts.forEach((contract) => {
        const newCw20contract = CW20(client).use(contract.address);
        addContract(newCw20contract);
      });
    });
  }, [addContract, config.codeId, getSigningClient]);

  useEffect(() => {
    const tokenPromises = cw20Contracts.map((contract) => getTokenData(contract, getAddress()));
    Promise.all(tokenPromises).then((tokens) =>
      setTokens(tokens.filter((token) => token.address).sort(tokenCompare)),
    );
  }, [cw20Contracts, getAddress]);

  function goTokenDetail(tokenAddress: string) {
    history.push(`${pathTokensMatched}/${tokenAddress}`);
  }

  return (
    <PageLayout hide="back-button">
      <MainStack>
        <Title>Tokens</Title>
        <TokenStack>
          {tokens.map((token) => {
            const amountToDisplay = Decimal.fromAtomics(token.coin.amount, token.fractionalDigits).toString();

            return (
              <Button
                key={token.coin.denom}
                data-size="large"
                type="primary"
                onClick={() => goTokenDetail(token.address)}
              >
                <TokenItem>
                  <Text>{token.coin.denom}</Text>
                  <Text>{amountToDisplay !== "0" ? amountToDisplay : "No tokens"}</Text>
                </TokenItem>
              </Button>
            );
          })}
        </TokenStack>
        <Link to={`${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAdd}`}>
          <Button type="primary">Add other tokens</Button>
        </Link>
        <Link to={`${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensNew}`}>
          <Button type="primary">Create new token</Button>
        </Link>
      </MainStack>
    </PageLayout>
  );
}
