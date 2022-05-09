import { Typography } from "antd";
import pinDarkIcon from "App/assets/icons/pin-dark.svg";
import pinLightIcon from "App/assets/icons/pin-light.svg";
import AddressTag from "App/components/AddressTag";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import { useTMarket } from "service/tmarket";
import { useTokens } from "service/tokens";
import { Contract20WS, MarketingInfoResponse } from "utils/cw20";
import { isValidAddress } from "utils/forms";
import { isValidUrl } from "utils/query";
import { TcContractQuerier } from "utils/trustedCircle";

import { PinTokenBalance, TcData, TokenDetailStack } from "./style";

const { Text, Paragraph } = Typography;

const defaultMarketingInfo: MarketingInfoResponse = {
  project: "Tgrade token",
  description: "The native token for Tgrade",
  marketing: "https://try.tgrade.finance/",
};

export default function TokenDetail(): JSX.Element | null {
  const {
    sdkState: { config, client },
  } = useSdk();
  const {
    tokensState: { tokens, loadToken, pinnedTokens, pinUnpinToken },
  } = useTokens();
  const {
    tMarketState: { searchText },
  } = useTMarket();

  const [searchedToken, setSearchedToken] = useState(tokens.get(config.feeToken));
  const [tcAddress, setTcAddress] = useState<string>();
  const [tcName, setTcName] = useState<string>();
  const [marketingInfo, setMarketingInfo] = useState<MarketingInfoResponse>(defaultMarketingInfo);

  useEffect(() => {
    (async function () {
      if (
        !searchText ||
        !isValidAddress(searchText, config.addressPrefix) ||
        marketingInfo === defaultMarketingInfo
      )
        return;

      try {
        await loadToken?.(searchText);
      } catch {
        return;
      }
    })();
  }, [config.addressPrefix, loadToken, marketingInfo, searchText]);

  useEffect(() => {
    const searchedToken = !searchText ? tokens.get(config.feeToken) : tokens.get(searchText);
    setSearchedToken(searchedToken);
  }, [config.feeToken, searchText, tokens]);

  useEffect(() => {
    (async function () {
      if (!searchText || !isValidAddress(searchText, config.addressPrefix) || !client) {
        setTcAddress(undefined);
        return;
      }

      try {
        const tcAddress = await Contract20WS.getDsoAddress(client, searchText);
        setTcAddress(tcAddress);
      } catch {
        setTcAddress(undefined);
      }
    })();
  }, [client, config.addressPrefix, searchText]);

  useEffect(() => {
    (async function () {
      if (!searchText || !isValidAddress(searchText, config.addressPrefix) || !client || !tcAddress) {
        setTcName(undefined);
        return;
      }

      try {
        const tcContract = new TcContractQuerier(tcAddress, client);
        const { name: tcName } = await tcContract.getTc();
        setTcName(tcName);
      } catch {
        setTcName(undefined);
      }
    })();
  }, [client, config.addressPrefix, searchText, tcAddress]);

  useEffect(() => {
    (async function () {
      if (!searchText || !isValidAddress(searchText, config.addressPrefix) || !client) {
        setMarketingInfo(defaultMarketingInfo);
        return;
      }

      try {
        const marketingInfo = await Contract20WS.getMarketingInfo(client, searchText);
        setMarketingInfo(marketingInfo);
      } catch {
        setMarketingInfo(defaultMarketingInfo);
      }
    })();
  }, [client, config.addressPrefix, searchText]);

  return searchedToken ? (
    <TokenDetailStack>
      <PinTokenBalance>
        {searchedToken.address !== config.feeToken ? (
          <img
            src={pinnedTokens.includes(searchedToken.address) ? pinDarkIcon : pinLightIcon}
            alt={pinnedTokens.includes(searchedToken.address) ? "Unpin token" : "Pin token"}
            onClick={(event) => {
              event.stopPropagation();
              pinUnpinToken?.(searchedToken.address);
            }}
          />
        ) : null}
        <img alt="Token logo" src={searchedToken.img} />
        <Text>
          {searchedToken.name} balance: {searchedToken.humanBalance} {searchedToken.symbol}
        </Text>
      </PinTokenBalance>
      {tcAddress && tcName ? (
        <TcData>
          <Text>Trusted Circle: {tcName}</Text>
          <AddressTag address={tcAddress} short copyable />
        </TcData>
      ) : null}
      {marketingInfo.project ? <Text>{marketingInfo.project}</Text> : null}
      {marketingInfo.description ? <Text>{marketingInfo.description}</Text> : null}
      {marketingInfo.marketing ? (
        isValidUrl(marketingInfo.marketing) ? (
          <a href={marketingInfo.marketing} target="_blank" rel="noopener noreferrer">
            {marketingInfo.marketing}
          </a>
        ) : (
          <Text>{marketingInfo.marketing}</Text>
        )
      ) : null}
    </TokenDetailStack>
  ) : (
    <Paragraph>No token found</Paragraph>
  );
}
