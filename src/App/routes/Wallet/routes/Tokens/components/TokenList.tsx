import { Coin } from "@cosmjs/stargate";
import { Stack } from "App/components/layout";
import * as React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSdk } from "service";
import { nativeCoinToDisplay, useBalance } from "utils/currency";
import TokenButton from "./TokenButton";

interface TokenListProps {
  readonly currentAddress: string;
}

export default function TokenList({ currentAddress }: TokenListProps): JSX.Element {
  const history = useHistory();
  const { url: pathTokensMatched } = useRouteMatch();

  const {
    sdkState: { config, address },
  } = useSdk();
  const balance = useBalance(currentAddress);

  const amAllowed = address === currentAddress;
  function goTokenDetail(token: Coin) {
    history.push(`${pathTokensMatched}/${token.denom}`);
  }

  return (
    <Stack>
      {balance.map((nativeToken) => {
        const { denom: denomToDisplay, amount: amountToDisplay } = nativeCoinToDisplay(
          nativeToken,
          config.coinMap,
        );

        return (
          <TokenButton
            key={nativeToken.denom}
            denom={denomToDisplay}
            amount={amountToDisplay}
            disabled={amountToDisplay === "0" || !amAllowed}
            onClick={() => goTokenDetail(nativeToken)}
          />
        );
      })}
    </Stack>
  );
}
