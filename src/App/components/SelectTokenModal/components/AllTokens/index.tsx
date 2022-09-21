import Button from "App/components/Button";
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

interface AllTokensProps {
  readonly setToken: (t: TokenHuman) => void;
  readonly closeModal: () => void;
  readonly tokenFilter: "exclude-lp" | "lp-only";
}

export default function AllTokens({ setToken, closeModal, tokenFilter }: AllTokensProps): JSX.Element {
  const {
    sdkState: { config },
  } = useSdk();
  const {
    tokensState: { tokens, canLoadNextTokens, loadNextTokens, pairs },
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

    const filteredTokensList = filterTokensByText(tokensListLp, searchText);

    setTokensList(filteredTokensList);
  }, [config.feeToken, pairs, searchText, tokenFilter, tokens]);

  const [isLoadingMore, setLoadingMore] = useState(false);

  return (
    <Stack>
      <ListTokens tokensList={tokensList} closeModal={closeModal} setToken={setToken} />
      <Button
        style={{ alignSelf: "center" }}
        disabled={!canLoadNextTokens}
        loading={isLoadingMore}
        onClick={async () => {
          setLoadingMore(true);
          await loadNextTokens?.();
          setLoadingMore(false);
        }}
      >
        <span>Load more</span>
      </Button>
    </Stack>
  );
}
