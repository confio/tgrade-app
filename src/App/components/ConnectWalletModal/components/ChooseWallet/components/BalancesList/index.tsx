import { SendOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import pinDarkIcon from "App/assets/icons/pin-dark.svg";
import pinLightIcon from "App/assets/icons/pin-light.svg";
import LoadingSpinner from "App/components/LoadingSpinner";
import SendTokenModal from "App/components/SendTokenModal";
import Stack from "App/components/Stack/style";
import TooltipWrapper from "App/components/TooltipWrapper";
import { paths } from "App/paths";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSdk } from "service";
import { tokensMapToArray, useTokens } from "service/tokens";
import { TokenProps } from "utils/tokens";

import {
  BalancesContainer,
  BalancesItem,
  SearchToken,
  TokenDetailPin,
  TokenLogoName,
  TooltipStack,
} from "./style";

const { Text } = Typography;

interface BalancesListProps {
  readonly closeModal: () => void;
}

export function BalancesList({ closeModal }: BalancesListProps): JSX.Element {
  const {
    sdkState: { config },
  } = useSdk();
  const {
    tokensState: { pinnedTokens, pinUnpinToken, reloadPinnedTokensOnly, tokens },
  } = useTokens();

  const [queryTokensState, setQueryTokensState] = useState<"initial" | "loading" | "loaded">("initial");
  const [searchText, setSearchText] = useState("");
  const [tokenList, setTokenList] = useState<readonly TokenProps[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenProps>();

  useEffect(() => {
    (async function () {
      if (!reloadPinnedTokensOnly || queryTokensState !== "initial") return;

      setQueryTokensState("loading");
      await reloadPinnedTokensOnly();
      setQueryTokensState("loaded");
    })();
  }, [queryTokensState, reloadPinnedTokensOnly]);

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

  const isCbdc = window.location.href.includes("cbdc");
  const tMarketTitle = isCbdc ? "CBDC-Marketplace" : "T-Market";

  return (
    <Stack gap="s1">
      <TooltipWrapper
        title={
          <TooltipStack gap="s-2">
            <Text>Not seeing all your tokens?</Text>
            <Text>
              You need to go to{" "}
              <Link to={paths.tmarket.prefix} onClick={() => closeModal()}>
                {tMarketTitle}
              </Link>
              , search for the missing token, and pin it.
            </Text>
            <Text>If it has some balance, it will show in your wallet.</Text>
          </TooltipStack>
        }
      >
        <Text style={{ color: "black" }}>Available tokens to send</Text>
      </TooltipWrapper>
      {queryTokensState === "loaded" && tokenList.length ? (
        <SearchToken
          placeholder="Search token"
          allowClear
          onChange={({ target }) => setSearchText(target.value)}
          style={{ width: "100%", borderRadius: "100%" }}
        />
      ) : null}
      {queryTokensState === "loading" ? (
        <LoadingSpinner spinProps={{ style: { height: "75px" }, delay: 500 }} />
      ) : null}
      {queryTokensState === "loaded" && tokenList.length ? (
        <BalancesContainer>
          {tokenList.map((token) => (
            <BalancesItem
              key={token.address}
              onClick={() => {
                setSelectedToken(token);
              }}
              data-cy={`wallet-dialog-list-of-tokens-with-${token.symbol}`}
            >
              <TokenLogoName>
                <img alt="Token logo" src={token.img} />
                <div>
                  <Text>Send </Text>
                  <Text>{token.symbol}</Text>
                </div>
                <SendOutlined color="red" />
              </TokenLogoName>
              <TokenDetailPin>
                <div>
                  <Text data-cy="connect-wallet-modal-token-balance">{token.humanBalance}</Text>
                  <Text
                    onClick={(event) => {
                      event?.stopPropagation();
                    }}
                    copyable={
                      token.address === "utgd"
                        ? false
                        : { text: token.address, tooltips: "Copy token address" }
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
      ) : null}
      {queryTokensState === "loaded" && !tokenList.length ? (
        <Text>No balance found for pinned tokens</Text>
      ) : null}
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
