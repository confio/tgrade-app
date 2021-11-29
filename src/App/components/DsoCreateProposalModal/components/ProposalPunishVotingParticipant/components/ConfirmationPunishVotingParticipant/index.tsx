import { calculateFee } from "@cosmjs/stargate";
import { Typography } from "antd";
import AddressList from "App/components/AddressList";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import { lazy, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { getDisplayAmountFromFee } from "utils/currency";
import { DsoContract } from "utils/dso";

import { AddressStack, ButtonGroup, ConfirmField, FeeGroup, Separator, TextComment } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));
const { Text, Paragraph } = Typography;

interface ConfirmationPunishVotingParticipantProps {
  readonly memberToPunish: string;
  readonly slashingPercentage: string;
  readonly memberEscrow: string;
  readonly kickOut: boolean;
  readonly distributionList: readonly string[];
  readonly comment: string;
  readonly isSubmitting: boolean;
  readonly goBack: () => void;
  readonly submitForm: () => void;
}

export default function ConfirmationPunishVotingParticipant({
  memberToPunish,
  slashingPercentage,
  memberEscrow,
  kickOut,
  distributionList,
  comment,
  isSubmitting,
  goBack,
  submitForm,
}: ConfirmationPunishVotingParticipantProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, signer, signingClient },
  } = useSdk();

  const [isModalOpen, setModalOpen] = useState(false);
  const [txFee, setTxFee] = useState("0");
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";

  useEffect(() => {
    if (!signingClient) return;

    try {
      const fee = calculateFee(DsoContract.GAS_PROPOSE, config.gasPrice);
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
        <Text>Member to punish: </Text>
        <Text>{memberToPunish}</Text>
      </ConfirmField>
      <ConfirmField>
        <Text>
          {kickOut
            ? "The member WILL BE kicked out of the Trusted Circle"
            : "The member WILL NOT BE kicked out of the Trusted Circle"}
        </Text>
      </ConfirmField>
      {slashingPercentage && slashingPercentage !== "0" ? (
        <ConfirmField>
          <Text>Slashing: </Text>
          <Text>{`${slashingPercentage}% of ${memberEscrow} ${feeTokenDenom}`}</Text>
        </ConfirmField>
      ) : null}
      {distributionList.length ? (
        <AddressStack gap="s-3">
          <Text>Addresses to distribute the slashed escrow to:</Text>
          <AddressList short addresses={distributionList} addressPrefix={config.addressPrefix} />
        </AddressStack>
      ) : null}
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
