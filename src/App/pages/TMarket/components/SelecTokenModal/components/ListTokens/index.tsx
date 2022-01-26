import { List, Typography } from "antd";
import pinDarkIcon from "App/assets/icons/pin-dark.svg";
import pinLightIcon from "App/assets/icons/pin-light.svg";
import tempImgUrl from "App/assets/icons/token-placeholder.png";
import LoadingSpinner from "App/components/LoadingSpinner";
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

function loadDefaultImg(event: React.SyntheticEvent<HTMLImageElement, Event>): void {
  event.currentTarget.onerror = null;
  event.currentTarget.src = tempImgUrl;
}

interface ListTokensProps {
  readonly tokens: readonly TokenProps[];
  readonly setToken: (t: TokenProps) => void;
  readonly closeModal: () => void;
}

export default function ListTokens({ tokens, setToken, closeModal }: ListTokensProps): JSX.Element {
  const {
    sdkState: { config },
  } = useSdk();
  const {
    tMarketState: { tokensFilter },
  } = useTMarket();
  const [tokensList, setTokensList] = useState<readonly TokenProps[]>([]);
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
    const filteredTokensList =
      tokensFilter === "whitelist"
        ? tokens.filter((token) => pinnedTokens.includes(token.address) || token.balance !== "0")
        : tokens;

    const sortedTokensList = filteredTokensList.slice().sort(compareTokensWithPinned);
    setTokensList(sortedTokensList);
  }, [compareTokensWithPinned, pinnedTokens, tokens, tokensFilter]);

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
              {!token.symbol.startsWith("LP-") ? (
                <img src={token.img} alt={token.img} onError={loadDefaultImg} />
              ) : null}
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
