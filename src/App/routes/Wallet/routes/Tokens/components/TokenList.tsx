import { Coin } from "@cosmjs/launchpad";
import { Stack } from "App/components/layout";
import { TokenButton } from "App/components/logic";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { nativeCoinToDisplay, useBalance } from "utils/currency";

interface TokenListProps {
  readonly currentAddress: string;
}

export default function TokenList({ currentAddress }: TokenListProps): JSX.Element {
  const { url: pathTokensMatched } = useRouteMatch();
  const { handleError } = useError();
  const { getConfig, getAddress, getQueryClient } = useSdk();
  const config = getConfig();
  const amAllowed = getAddress() === currentAddress;
  const balance = useBalance();
  const [currentBalance, setCurrentBalance] = useState<readonly Coin[]>([]);

  useEffect(() => {
    let mounted = true;

    if (amAllowed) {
      if (mounted) setCurrentBalance(balance);
    } else {
      const balance: Coin[] = [];
      (async function updateCurrentBalance(): Promise<void> {
        try {
          for (const denom in config.coinMap) {
            const coin = await getQueryClient().bank.unverified.balance(currentAddress, denom);
            balance.push(coin);
          }
        } catch (error) {
          balance.length = 0;
          handleError(error);
        } finally {
          if (mounted) setCurrentBalance(balance);
        }
      })();
    }

    return () => {
      mounted = false;
    };
  }, [amAllowed, balance, config.coinMap, currentAddress, getQueryClient, handleError]);

  const history = useHistory();
  function goTokenDetail(token: Coin) {
    history.push(`${pathTokensMatched}/${token.denom}`);
  }

  return (
    <Stack>
      {currentBalance.map((nativeToken) => {
        const { denom: denomToDisplay, amount: amountToDisplay } = nativeCoinToDisplay(
          nativeToken,
          config.coinMap,
        );

        return (
          <TokenButton
            key={nativeToken.denom}
            denom={denomToDisplay}
            amount={amountToDisplay}
            onClick={() => {
              amAllowed && goTokenDetail(nativeToken);
            }}
          />
        );
      })}
    </Stack>
  );
}
