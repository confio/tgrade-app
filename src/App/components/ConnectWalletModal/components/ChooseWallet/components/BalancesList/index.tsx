import { Typography } from "antd";
import pinDarkIcon from "App/assets/icons/pin-dark.svg";
import pinLightIcon from "App/assets/icons/pin-light.svg";
import SendTokenModal from "App/components/SendTokenModal";
import Stack from "App/components/Stack/style";
import { getTokensList } from "App/pages/TMarket/utils";
import { useCallback, useEffect, useState } from "react";
import { useSdk } from "service";
import { Contract20WS } from "utils/cw20";
import { usePinnedTokens } from "utils/storage";
import { TokenProps } from "utils/tokens";

import { BalancesContainer, BalancesItem, SearchToken, TokenDetailPin, TokenLogoName } from "./style";

const { Text } = Typography;

export function BalancesList(): JSX.Element {
  const {
    sdkState: { address, config, client },
  } = useSdk();

  const [searchText, setSearchText] = useState("");
  const [tokenList, setTokenList] = useState<readonly TokenProps[]>([]);
  const [pinnedTokens, setPinnedTokens] = usePinnedTokens();
  const [selectedToken, setSelectedToken] = useState<TokenProps>();

  const compareTokensWithPinned = useCallback(
    function (a: TokenProps, b: TokenProps): -1 | 0 | 1 {
      if (pinnedTokens.includes(a.address) && !pinnedTokens.includes(b.address)) return -1;
      if (!pinnedTokens.includes(a.address) && pinnedTokens.includes(b.address)) return 1;

      if (a.symbol < b.symbol) return -1;
      if (a.symbol > b.symbol) return 1;

      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;

      return 0;
    },
    [pinnedTokens],
  );

  const refreshBalances = useCallback(async () => {
    if (!address || !client) return;

    const tokens = await Contract20WS.getAll(config, client, address);
    const tokenList = getTokensList(tokens, searchText);
    const filteredTokensList = tokenList.filter((token) => token.balance !== "0");

    const sortedTokensList = filteredTokensList.slice().sort(compareTokensWithPinned);
    setTokenList(sortedTokensList);
  }, [address, client, compareTokensWithPinned, config, searchText]);

  useEffect(() => {
    refreshBalances();
  }, [refreshBalances]);

  function pinUnpin(address: string) {
    if (pinnedTokens.includes(address)) {
      setPinnedTokens((tokens) => tokens.filter((token) => token !== address));
    } else {
      setPinnedTokens((tokens) => [...tokens, address]);
    }
  }

  return (
    <Stack gap="s1">
      {tokenList.length ? <Text>Available balance:</Text> : <Text>No balance available</Text>}
      <SearchToken
        placeholder="Search token"
        allowClear
        onChange={({ target }) => setSearchText(target.value)}
        style={{ width: "100%", borderRadius: "100%" }}
      />
      <BalancesContainer>
        {tokenList.map((token) => (
          <BalancesItem
            onClick={() => {
              setSelectedToken(token);
            }}
          >
            <TokenLogoName>
              <img alt="Token logo" src={token.img} />
              <Text>{token.symbol}</Text>
            </TokenLogoName>
            <TokenDetailPin>
              <div>
                <Text>{token.humanBalance}</Text>
                <Text
                  onClick={(event) => {
                    event?.stopPropagation();
                  }}
                  copyable={
                    token.address === "utgd" ? false : { text: token.address, tooltips: "Copy token address" }
                  }
                >
                  {token.address === "utgd" ? "native" : `…${token.address.slice(-10)}`}
                </Text>
              </div>
              <img
                src={pinnedTokens.includes(token.address) ? pinDarkIcon : pinLightIcon}
                alt={pinnedTokens.includes(token.address) ? "Unpin token" : "Pin token"}
                onClick={(event) => {
                  event.stopPropagation();
                  pinUnpin(token.address);
                }}
              />
            </TokenDetailPin>
          </BalancesItem>
        ))}
      </BalancesContainer>
      <SendTokenModal
        isModalOpen={!!selectedToken}
        closeModal={() => {
          setSelectedToken(undefined);
        }}
        selectedToken={selectedToken}
        refreshBalances={refreshBalances}
      />
    </Stack>
  );
}
