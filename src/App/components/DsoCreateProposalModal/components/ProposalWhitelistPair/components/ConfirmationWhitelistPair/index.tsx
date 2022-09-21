import { calculateFee } from "@cosmjs/stargate";
import { Typography } from "antd";
import AddressTag from "App/components/AddressTag";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import { lazy, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { useTokens } from "service/tokens";
import { getDisplayAmountFromFee } from "utils/currency";
import { AssetInfos } from "utils/factory";
import { TokenHuman } from "utils/tokens";
import { TcContract } from "utils/trustedCircle";
import { ellipsifyAddress } from "utils/ui";

import { AddressStack, ButtonGroup, FeeGroup, FieldLabel, Separator, TextComment } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));
const { Paragraph } = Typography;

interface ConfirmationWhitelistPairProps {
  readonly pairAddress: string;
  readonly comment: string;
  readonly isSubmitting: boolean;
  readonly goBack: () => void;
  readonly submitForm: () => void;
}

export default function ConfirmationWhitelistPair({
  pairAddress,
  comment,
  isSubmitting,
  goBack,
  submitForm,
}: ConfirmationWhitelistPairProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, signer, signingClient },
  } = useSdk();
  const {
    tokensState: { pairs, tokens },
  } = useTokens();

  const [isModalOpen, setModalOpen] = useState(false);
  const [assetInfos, setAssetInfos] = useState<AssetInfos>();
  const [tokenProps, setTokenProps] = useState<readonly [TokenHuman | undefined, TokenHuman | undefined]>();
  const [txFee, setTxFee] = useState("0");
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";

  useEffect(() => {
    if (!signingClient) return;

    try {
      const fee = calculateFee(TcContract.GAS_PROPOSE, config.gasPrice);
      const txFee = getDisplayAmountFromFee(fee, config);
      setTxFee(txFee);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }, [config, handleError, signingClient]);

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

  return (
    <>
      <AddressStack gap="s-3">
        <FieldLabel>Pair to be whitelisted</FieldLabel>
        <AddressTag address={pairAddress} />
        {tokenAddressA && tokenAddressB ? (
          <FieldLabel>{`${tokenSymbolA}(${tokenAddressA}) ⇄ ${tokenSymbolB}(${tokenAddressB})`}</FieldLabel>
        ) : null}
      </AddressStack>
      <TextComment>{comment}</TextComment>
      <Separator />
      <ButtonGroup>
        <BackButtonOrLink disabled={isSubmitting} onClick={() => goBack()} text="Back" />
        <FeeGroup>
          <Typography>
            <Paragraph>Tx fee</Paragraph>
            <Paragraph>{`~${txFee} ${feeTokenDenom}`}</Paragraph>
          </Typography>
          <Button loading={isSubmitting} onClick={signer ? () => submitForm() : () => setModalOpen(true)}>
            <div>{signer ? "Confirm proposal" : "Connect wallet"}</div>
          </Button>
        </FeeGroup>
      </ButtonGroup>
      <ConnectWalletModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </>
  );
}
