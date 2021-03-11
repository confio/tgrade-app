import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { PageLayout, Stack } from "App/components/layout";
import { NavPagination, pageSize, TokenButton } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useContracts, useSdk } from "service";
import { CW20, Cw20Token, cw20TokenCompare, getCw20Token } from "utils/cw20";

const { Title } = Typography;

export default function TokensList(): JSX.Element {
  const { url: pathTokensMatched } = useRouteMatch();
  const history = useHistory();
  const { getConfig, getSigningClient, getAddress } = useSdk();
  const { contracts: cw20Contracts, addContract } = useContracts();

  const [cw20Tokens, setCw20Tokens] = useState<readonly Cw20Token[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

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
    let mounted = true;

    const cw20TokenPromises = cw20Contracts.map((contract) => getCw20Token(contract, getAddress()));

    (async function updateCw20Tokens() {
      const cw20Tokens = await Promise.all(cw20TokenPromises);
      const sortedNonNullCw20Tokens = cw20Tokens
        .filter((token): token is Cw20Token => token !== null)
        .sort(cw20TokenCompare);

      if (mounted) setCw20Tokens(sortedNonNullCw20Tokens);
    })();

    return () => {
      mounted = false;
    };
  }, [cw20Contracts, getAddress]);

  function goTokenDetail(tokenAddress: string) {
    history.push(`${pathTokensMatched}/${tokenAddress}`);
  }

  return (
    <PageLayout hide="back-button">
      <Stack gap="s4">
        <Title>Tokens</Title>
        <NavPagination currentPage={currentPage} setCurrentPage={setCurrentPage} total={cw20Tokens.length} />
        <Stack>
          {cw20Tokens.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((token) => {
            const amountToDisplay = Decimal.fromAtomics(token.amount, token.decimals).toString();

            return (
              <TokenButton
                key={token.address + token.symbol}
                denom={token.symbol}
                amount={amountToDisplay}
                onClick={() => goTokenDetail(token.address)}
              />
            );
          })}
        </Stack>
        <Link to={`${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAdd}`}>
          <Button type="primary">Add Another</Button>
        </Link>
      </Stack>
    </PageLayout>
  );
}
