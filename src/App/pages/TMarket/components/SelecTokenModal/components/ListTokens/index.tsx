import { Typography } from "antd";
import pinDarkIcon from "App/assets/icons/pin-dark.svg";
import pinLightIcon from "App/assets/icons/pin-light.svg";
import tempImgUrl from "App/assets/icons/token-placeholder.png";
import { useSdk } from "service";
import { useTokens } from "service/tokens";
import { TokenProps } from "utils/tokens";

import {
  ContainerLogoNames,
  ContainerNames,
  ContainerNumbers,
  ContainerNumbersPin,
  StyledList,
  TokenListItem,
} from "./style";

const { Paragraph } = Typography;

function loadDefaultImg(event: React.SyntheticEvent<HTMLImageElement, Event>): void {
  event.currentTarget.onerror = null;
  event.currentTarget.src = tempImgUrl;
}

interface ListTokensProps {
  readonly tokensList: readonly TokenProps[];
  readonly setToken: (t: TokenProps) => void;
  readonly closeModal: () => void;
}

export default function ListTokens({ tokensList, setToken, closeModal }: ListTokensProps): JSX.Element {
  const {
    sdkState: { config },
  } = useSdk();
  const {
    tokensState: { pinnedTokens, pinUnpinToken },
  } = useTokens();

  return tokensList.length ? (
    <StyledList
      pagination={{ pageSize: 8, hideOnSinglePage: true }}
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
                <Paragraph aria-label={token.name}>{token.name}</Paragraph>
              </ContainerNames>
            </ContainerLogoNames>
            <ContainerNumbersPin>
              <ContainerNumbers>
                <Paragraph>{token.humanBalance}</Paragraph>
                {token.address !== config.feeToken ? (
                  <Paragraph
                    onClick={(event) => {
                      event?.stopPropagation();
                    }}
                    copyable={{ tooltips: "Copy token address" }}
                  >
                    {token.address}
                  </Paragraph>
                ) : (
                  <Paragraph>{"Tgrade token"}</Paragraph>
                )}
              </ContainerNumbers>
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
            </ContainerNumbersPin>
          </TokenListItem>
        );
      }}
    />
  ) : (
    <Paragraph>No tokens found</Paragraph>
  );
}
