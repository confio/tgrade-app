import Stack from "App/components/Stack/style";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import { useTMarket } from "service/tmarket";
import {
  excludeLpTokens,
  filterTokensByText,
  formatLpTokens,
  includeOnlyLpTokens,
  tokensMapToArray,
  useTokens,
} from "service/tokens";
import { TokenHuman } from "utils/tokens";

import ListTokens from "../ListTokens";

interface PinnedTokensProps {
  readonly setToken: (t: TokenHuman) => void;
  readonly closeModal: () => void;
  readonly tokenFilter: "exclude-lp" | "lp-only";
}

export default function PinnedTokens({ setToken, closeModal, tokenFilter }: PinnedTokensProps): JSX.Element {
  const {
    sdkState: { config },
  } = useSdk();
  const {
    tokensState: { tokens, pinnedTokens, pairs },
  } = useTokens();
  const {
    tMarketState: { searchText },
  } = useTMarket();

  const [tokensList, setTokensList] = useState<readonly TokenHuman[]>([]);

  useEffect(() => {
    const tokensList = tokensMapToArray(tokens, config.feeToken);
    const tokensListLp =
      tokenFilter === "exclude-lp"
        ? excludeLpTokens(tokensList)
        : includeOnlyLpTokens(formatLpTokens(tokensList, Array.from(pairs.values())));
    const filteredTokensList = filterTokensByText(tokensListLp, searchText).filter((token) =>
      pinnedTokens.includes(token.address),
    );

    setTokensList(filteredTokensList);
  }, [config.feeToken, pairs, pinnedTokens, searchText, tokenFilter, tokens]);

  return (
    <Stack data-testid="pinned-tokens-tab">
      <ListTokens tokensList={tokensList} closeModal={closeModal} setToken={setToken} />
    </Stack>
  );
}
