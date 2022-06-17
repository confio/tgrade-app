import { calculateFee, Coin } from "@cosmjs/stargate";
import { Typography } from "antd";
import AddressTag from "App/components/AddressTag";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { lazy, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { getDisplayAmountFromFee, nativeCoinToDisplay } from "utils/currency";
import { isValidAddress } from "utils/forms";
import { OcContract } from "utils/oversightCommunity";
import { EngagementContractQuerier } from "utils/poeEngagement";
import { StakingContractQuerier } from "utils/staking";

import { ButtonGroup, ConfirmField, FeeGroup, Heading, Separator, TextComment } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));
const { Text, Paragraph } = Typography;

interface SlashingData {
  readonly staked?: Coin;
  readonly stakedAmountToSlash?: number;
  readonly points?: number;
  readonly pointsToSlash?: number;
}

interface ConfirmationPunishValidatorProps {
  readonly validatorToPunish: string;
  readonly slashingPercentage: string;
  readonly jail: string;
  readonly jailedUntil: string;
  readonly comment: string;
  readonly isSubmitting: boolean;
  readonly goBack: () => void;
  readonly submitForm: () => void;
}

export default function ConfirmationPunishValidator({
  validatorToPunish,
  jail,
  jailedUntil,
  slashingPercentage,
  comment,
  isSubmitting,
  goBack,
  submitForm,
}: ConfirmationPunishValidatorProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client, signer, signingClient },
  } = useSdk();
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";

  const [isModalOpen, setModalOpen] = useState(false);
  const [slashingData, setSlashingData] = useState<SlashingData>();
  const [txFee, setTxFee] = useState("0");

  useEffect(() => {
    (async function () {
      if (
        !client ||
        !validatorToPunish ||
        !isValidAddress(validatorToPunish, config.addressPrefix) ||
        !slashingPercentage ||
        slashingPercentage === "0"
      )
        return;

      try {
        const stakingContract = new StakingContractQuerier(config, client);
        const nativeStakedCoin = await stakingContract.getStakedTokensSum(validatorToPunish);
        const staked = nativeCoinToDisplay(nativeStakedCoin, config.coinMap);
        const slashingPercentageNumber = parseFloat(slashingPercentage) / 100;
        const stakedAmountToSlash = Number(staked.amount) * slashingPercentageNumber;

        const egContract = new EngagementContractQuerier(config, PoEContractType.DISTRIBUTION, client);
        const points = await egContract.getEngagementPoints(validatorToPunish);
        const pointsToSlash = points * slashingPercentageNumber;
        setSlashingData({ staked, stakedAmountToSlash, points, pointsToSlash });
      } catch {
        setSlashingData(undefined);
      }
    })();
  }, [client, config, slashingPercentage, validatorToPunish]);

  useEffect(() => {
    if (!signingClient) return;

    try {
      const fee = calculateFee(OcContract.GAS_PROPOSE, config.gasPrice);
      const txFee = getDisplayAmountFromFee(fee, config);
      setTxFee(txFee);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }, [config, handleError, signingClient]);

  return (
    <>
      <ConfirmField>
        <Text>Validator to be punished: </Text>
        <AddressTag address={validatorToPunish} />
      </ConfirmField>
      {jail || jailedUntil ? (
        <TextComment>
          <b style={{ color: "red" }}>{jail ? "Jailed Forever" : `Jailed until ${jailedUntil}`}</b>
        </TextComment>
      ) : null}
      {slashingData?.staked && slashingData?.staked.amount !== "0" ? (
        <ConfirmField>
          <Heading>Tokens to be slashed: </Heading>
          <Text>{`${slashingPercentage}% of ${slashingData?.staked.amount} ${slashingData?.staked.denom} = ${slashingData?.stakedAmountToSlash} ${slashingData?.staked.denom}`}</Text>
        </ConfirmField>
      ) : null}
      {slashingData ? (
        <ConfirmField>
          <Heading>Distributed Points to be slashed: </Heading>
          <Text>{`${slashingPercentage}% of ${slashingData?.points} = ${slashingData?.pointsToSlash}`}</Text>
        </ConfirmField>
      ) : null}
      {comment ? <TextComment>{comment}</TextComment> : null}
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
