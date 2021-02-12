import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useContracts, useSdk } from "service";
import { CW20, Cw20Token, cw20TokenCompare, getCw20Token } from "utils/cw20";
import { MainStack, TokenItem, TokenStack } from "./style";

const { Text, Title } = Typography;

export default function TokensList(): JSX.Element {
  const { url: pathTokensMatched } = useRouteMatch();
  const history = useHistory();
  const { getConfig, getSigningClient, getAddress } = useSdk();
  const { contracts: cw20Contracts, addContract } = useContracts();

  const [cw20Tokens, setCw20Tokens] = useState<readonly Cw20Token[]>([]);

  useEffect(() => {
    (async function updateContracts() {
      const config = getConfig();
      if (!config.codeId) return;

      const client = getSigningClient();
      const contracts = await client.getContracts(config.codeId);

      const cw20Contracts = contracts.map((contract) => CW20(client).use(contract.address));
      cw20Contracts.forEach(addContract);
    })();
  }, [addContract, getConfig, getSigningClient]);

  useEffect(() => {
    const cw20TokenPromises = cw20Contracts.map((contract) => getCw20Token(contract, getAddress()));

    (async function updateCw20Tokens() {
      const cw20Tokens = await Promise.all(cw20TokenPromises);
      const sortedNonNullCw20Tokens = cw20Tokens
        .filter((token): token is Cw20Token => token !== null)
        .sort(cw20TokenCompare);

      setCw20Tokens(sortedNonNullCw20Tokens);
    })();
  }, [cw20Contracts, getAddress]);

  function goTokenDetail(tokenAddress: string) {
    history.push(`${pathTokensMatched}/${tokenAddress}`);
  }

  return (
    <PageLayout hide="back-button">
      <MainStack>
        <Title>Tokens</Title>
        <TokenStack>
          {cw20Tokens.map((token) => {
            const amountToDisplay = Decimal.fromAtomics(token.amount, token.decimals).toString();

            return (
              <Button
                key={token.symbol}
                data-size="large"
                type="primary"
                onClick={() => goTokenDetail(token.address)}
              >
                <TokenItem>
                  <Text>{token.symbol}</Text>
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
