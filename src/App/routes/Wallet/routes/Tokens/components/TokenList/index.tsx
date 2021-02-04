import { Coin } from "@cosmjs/launchpad";
import { Button, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { TokenDetailState } from "../../../TokenDetail";
import { TokenItem, TokenStack } from "./style";

const { Text } = Typography;

interface TokenListProps {
  readonly currentAddress: string;
}

export default function TokenList({ currentAddress }: TokenListProps): JSX.Element {
  const { path } = useRouteMatch();
  const { getConfig, getClient, getAddress, getBalance: userBalance } = useSdk();
  const config = getConfig();
  const amAllowed = getAddress() === currentAddress;
  const [currentBalance, setCurrentBalance] = useState<readonly Coin[]>([]);

  useEffect(() => {
    if (amAllowed) {
      setCurrentBalance(userBalance);
    } else {
      setCurrentBalance([]);
      (async function updateCurrentBalance() {
        for (const denom in config.coinMap) {
          const coin = await getClient().getBalance(currentAddress, denom);
          if (coin) setCurrentBalance((prev) => [...prev, coin]);
        }
      })();
    }
  }, [amAllowed, config.coinMap, currentAddress, getClient, userBalance]);

  const history = useHistory<TokenDetailState>();
  function goTokenDetail(token: Coin) {
    history.push(`${path}/${token.denom}`, { tokenAmount: token.amount });
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
