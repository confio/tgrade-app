import Stack from "App/components/Stack/style";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import { useTMarket } from "service/tmarket";
import { useTokens } from "service/tokens";
import { isValidAddress } from "utils/forms";
import { TokenProps } from "utils/tokens";

interface TokenDetailProps {
  readonly setToken: (t: TokenProps) => void;
  readonly closeModal: () => void;
}

export default function TokenDetail({ setToken, closeModal }: TokenDetailProps): JSX.Element {
  const {
    sdkState: { config },
  } = useSdk();
  const {
    tokensState: { tokens, loadToken },
  } = useTokens();
  const {
    tMarketState: { searchText },
  } = useTMarket();

  const [searchedToken, setSearchedToken] = useState<TokenProps>();

  useEffect(() => {
    (async function () {
      if (!searchText || !isValidAddress(searchText, config.addressPrefix)) return;

      await loadToken?.(searchText);
    })();
  }, [config.addressPrefix, loadToken, searchText]);

  useEffect(() => {
    if (!searchText) return;

    const searchedToken = tokens.get(searchText);
    setSearchedToken(searchedToken);
  }, [searchText, tokens]);

  return (
    <Stack>
      <p>This view will show data for the searched token</p>
      {searchedToken ? <p>This view will show data for the searched token</p> : null}
    </Stack>
  );
}
