import { List, Typography } from "antd";
import pinDarkIcon from "App/assets/icons/pin-dark.svg";
import pinLightIcon from "App/assets/icons/pin-light.svg";
import LoadingSpinner from "App/components/LoadingSpinner";
import { getTokensList } from "App/pages/TMarket/utils";
import { useCallback, useEffect, useState } from "react";
import { useSdk } from "service";
import { useTMarket } from "service/tmarket";
import { usePinnedTokens } from "utils/storage";
import { TokenProps } from "utils/tokens";

import {
  ContainerLogoNames,
  ContainerNames,
  ContainerNumbers,
  ContainerNumbersPin,
  TokenListItem,
} from "./style";

const { Paragraph } = Typography;

interface ListTokensProps {
  setToken: (t: TokenProps) => void;
  closeModal: () => void;
}

export default function ListTokens({ setToken, closeModal }: ListTokensProps): JSX.Element {
  const {
    sdkState: { config },
  } = useSdk();
  const {
    tMarketState: { tokens, tokensFilter, searchText },
  } = useTMarket();
  const [tokensList, setTokensList] = useState<TokenProps[]>([]);
  const [pinnedTokens, setPinnedTokens] = usePinnedTokens();

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

  useEffect(() => {
    const tokensList = getTokensList(tokens, searchText);
    const filteredTokensList =
      tokensFilter === "whitelist"
        ? tokensList.filter((token) => pinnedTokens.includes(token.address) || token.balance !== "0")
        : tokensList;

    // TODO: Always remove liquidity tokens, but this also removes them from Withdraw
    //const nonLiquidityTokensList = filteredTokensList.filter((token) => token.symbol !== "uLP");

    const sortedTokensList = filteredTokensList.sort(compareTokensWithPinned);
    setTokensList(sortedTokensList);
  }, [compareTokensWithPinned, pinnedTokens, searchText, tokens, tokensFilter]);

  function pinUnpin(address: string) {
    if (pinnedTokens.includes(address)) {
      setPinnedTokens((tokens) => tokens.filter((token) => token !== address));
    } else {
      setPinnedTokens((tokens) => [...tokens, address]);
    }
  }

  return tokensList.length ? (
    <List
      dataSource={[...tokensList]}
      renderItem={(item: any) => {
        const token: TokenProps = item;
        return (
          <TokenListItem
            onClick={() => {
              setToken(token);
              closeModal();
            }}
          >
            <ContainerLogoNames>
              <img src={token.img} alt={token.img} />
              <ContainerNames>
                <Paragraph>{token.symbol}</Paragraph>
                <Paragraph>{token.name}</Paragraph>
              </ContainerNames>
            </ContainerLogoNames>
            <ContainerNumbersPin>
              <ContainerNumbers>
                <Paragraph>{token.humanBalance}</Paragraph>
                <Paragraph>{token.address === config.feeToken ? "native" : token.address}</Paragraph>
              </ContainerNumbers>
              <img
                src={pinnedTokens.includes(token.address) ? pinDarkIcon : pinLightIcon}
                alt={pinnedTokens.includes(token.address) ? "Unpin token" : "Pin token"}
                onClick={(event) => {
                  event.stopPropagation();
                  pinUnpin(token.address);
                }}
              />
            </ContainerNumbersPin>
          </TokenListItem>
        );
      }}
    />
  ) : (
    <LoadingSpinner />
  );
}
