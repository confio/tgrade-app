import { useEffect, useState } from "react";
import { useSdk } from "service";
import { useTokens } from "service/tokens";
import { Contract20WS } from "utils/cw20";
import { TokenHuman } from "utils/tokens";

import { ButtonSwapTokens } from "../ButtonSwapTokens";
import { TokenSelector } from "../TokenSelector";

export function PairSelector(): JSX.Element {
  const {
    sdkState: { config, client, address },
  } = useSdk();
  const {
    tokensState: { selectedTokenFrom, selectedTokenTo },
  } = useTokens();

  const [tokens, setTokens] = useState<readonly [TokenHuman?, TokenHuman?]>([undefined, undefined]);

  useEffect(() => {
    (async function () {
      if (!client || !address) return;

      const getTokenFrom = selectedTokenFrom
        ? Contract20WS.getTokenInfo(client, address, selectedTokenFrom, config)
        : Promise.resolve(undefined);

      const getTokenTo = selectedTokenTo
        ? Contract20WS.getTokenInfo(client, address, selectedTokenTo, config)
        : Promise.resolve(undefined);

      const tokens = await Promise.all([getTokenFrom, getTokenTo]);
      setTokens(tokens);
    })();
  }, [address, client, config, selectedTokenFrom, selectedTokenTo]);

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        padding: "20px",
        border: "1px solid #EDEEEE",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TokenSelector label={"From"} token={tokens[0]} />
      <ButtonSwapTokens />
      <TokenSelector label={"To"} token={tokens[1]} />
    </div>
  );
}
