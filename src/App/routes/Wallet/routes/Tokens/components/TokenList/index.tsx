import { Coin } from "@cosmjs/launchpad";
import { Button, Typography } from "antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { nativeCoinToDisplay, useBalance } from "utils/currency";
import { TokenItem, TokenStack } from "./style";

const { Text } = Typography;

interface TokenListProps {
  readonly currentAddress: string;
}

export default function TokenList({ currentAddress }: TokenListProps): JSX.Element {
  const { url: pathTokensMatched } = useRouteMatch();
  const { handleError } = useError();
  const { getConfig, getAddress, getSigningClient } = useSdk();
  const config = getConfig();
  const amAllowed = getAddress() === currentAddress;
  const balance = useBalance();
  const [currentBalance, setCurrentBalance] = useState<readonly Coin[]>([]);

  useEffect(() => {
    if (amAllowed) {
      setCurrentBalance(balance);
    } else {
      const balance: Coin[] = [];
      (async function updateCurrentBalance(): Promise<void> {
        try {
          for (const denom in config.coinMap) {
            const coin = await getSigningClient().getBalance(currentAddress, denom);
            if (coin) balance.push(coin);
          }
        } catch (error) {
          balance.length = 0;
          handleError(error);
        } finally {
          setCurrentBalance(balance);
        }
      })();
    }
  }, [amAllowed, balance, config.coinMap, currentAddress, getSigningClient, handleError]);

  const history = useHistory();
  function goTokenDetail(token: Coin) {
    history.push(`${pathTokensMatched}/${token.denom}`);
  }

  return (
    <TokenStack>
      {currentBalance.map((nativeToken) => {
        const { denom: denomToDisplay, amount: amountToDisplay } = nativeCoinToDisplay(
          nativeToken,
          config.coinMap,
        );

        return (
          <Button
            key={nativeToken.denom}
            disabled={!amAllowed}
            data-size="large"
            type="primary"
            onClick={() => {
              amAllowed && goTokenDetail(nativeToken);
            }}
          >
            <TokenItem>
              <Text>{denomToDisplay}</Text>
              <Text>{amountToDisplay !== "0" ? amountToDisplay : "No tokens"}</Text>
            </TokenItem>
          </Button>
        );
      })}
    </TokenStack>
  );
}
