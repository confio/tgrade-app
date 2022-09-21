import AddressTag from "App/components/AddressTag";
import { useEffect, useState } from "react";
import { useTokens } from "service/tokens";
import { AssetInfos } from "utils/factory";
import { TokenHuman } from "utils/tokens";
import { ellipsifyAddress } from "utils/ui";

import { AddressField, TextValue } from "../style";

interface ProposalWhitelistPairProps {
  readonly pairAddress?: string;
}

export default function ProposalWhitelistPair({
  pairAddress,
}: ProposalWhitelistPairProps): JSX.Element | null {
  const {
    tokensState: { pairs, tokens },
  } = useTokens();

  const [assetInfos, setAssetInfos] = useState<AssetInfos>();
  const [tokenProps, setTokenProps] = useState<readonly [TokenHuman | undefined, TokenHuman | undefined]>();

  useEffect(() => {
    (async function () {
      const pair = Array.from(pairs.values()).find((pair) => pair.contract_addr === pairAddress);
      if (pair) {
        const tokenA = Array.from(tokens.values()).find(
          (token) => token.address === (pair.asset_infos[0].native || pair.asset_infos[0].token),
        );
        const tokenB = Array.from(tokens.values()).find(
          (token) => token.address === (pair.asset_infos[1].native || pair.asset_infos[1].token),
        );

        setTokenProps([tokenA, tokenB]);
        setAssetInfos(pair.asset_infos);
      }
    })();
  }, [pairAddress, pairs, tokens]);

  const tokenAddressA = ellipsifyAddress(assetInfos?.[0].native || assetInfos?.[0].token || "");
  const tokenAddressB = ellipsifyAddress(assetInfos?.[1].native || assetInfos?.[1].token || "");
  const tokenSymbolA = tokenProps?.[0]?.symbol ?? "";
  const tokenSymbolB = tokenProps?.[1]?.symbol ?? "";

  return pairAddress?.length ? (
    <AddressField>
      <TextValue>Pair to be whitelisted:</TextValue>
      <AddressTag address={pairAddress} />
      {tokenAddressA && tokenAddressB ? (
        <TextValue>{`${tokenSymbolA}(${tokenAddressA}) ⇄ ${tokenSymbolB}(${tokenAddressB})`}</TextValue>
      ) : null}
    </AddressField>
  ) : null;
}
