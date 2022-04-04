import { Typography } from "antd";
import pinDarkIcon from "App/assets/icons/pin-dark.svg";
import pinLightIcon from "App/assets/icons/pin-light.svg";
import SendTokenModal from "App/components/SendTokenModal";
import Stack from "App/components/Stack/style";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import { tokensMapToArray, useTokens } from "service/tokens";
import { TokenProps } from "utils/tokens";

import { BalancesContainer, BalancesItem, SearchToken, TokenDetailPin, TokenLogoName } from "./style";

const { Text } = Typography;

export function BalancesList(): JSX.Element {
  const {
    sdkState: { config },
  } = useSdk();
  const {
    tokensState: { pinnedTokens, pinUnpinToken, reloadPinnedTokensOnly, tokens },
  } = useTokens();

  const [searchText, setSearchText] = useState("");
  const [tokenList, setTokenList] = useState<readonly TokenProps[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenProps>();

  useEffect(() => {
    (async function () {
      await reloadPinnedTokensOnly?.();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tokenList = tokensMapToArray(tokens, config.feeToken);
    const filteredTokensList = tokenList
      .filter((token) => pinnedTokens.includes(token.address))
      .filter((token) => token.balance !== "0")
      .filter(
        (token) =>
          token.symbol.toLowerCase().search(searchText.toLowerCase()) !== -1 ||
          token.name.toLowerCase().search(searchText.toLowerCase()) !== -1 ||
          token.address.toLowerCase().search(searchText.toLowerCase()) !== -1,
      );

    setTokenList(filteredTokensList);
  }, [config.feeToken, pinnedTokens, searchText, tokens]);

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
            key={token.address}
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
                  {token.address === "utgd" ? "Tgrade token" : `…${token.address.slice(-10)}`}
                </Text>
              </div>
              {token.address !== config.feeToken ? (
                <img
                  src={pinnedTokens.includes(token.address) ? pinDarkIcon : pinLightIcon}
                  alt={pinnedTokens.includes(token.address) ? "Unpin token" : "Pin token"}
                  onClick={(event) => {
                    event.stopPropagation();
                    pinUnpinToken?.(token.address);
                  }}
                />
              ) : null}
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
      />
    </Stack>
  );
}
