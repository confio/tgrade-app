import { Decimal } from "@cosmjs/math";
import { calculateFee } from "@cosmjs/stargate";
import { Typography } from "antd";
import AddressList from "App/components/AddressList";
import AddressTag from "App/components/AddressTag";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import { lazy, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { ApContract } from "utils/arbiterPool";
import { getDisplayAmountFromFee } from "utils/currency";

import { AddressStack, ButtonGroup, ConfirmField, FeeGroup, Separator, TextComment } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));
const { Text, Paragraph } = Typography;

interface ConfirmationPunishOCMemberProps {
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

export default function ConfirmationPunishOCMember({
  memberToPunish,
  slashingPercentage,
  memberEscrow,
  kickOut,
  distributionList,
  comment,
  isSubmitting,
  goBack,
  submitForm,
}: ConfirmationPunishOCMemberProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, signer, signingClient },
  } = useSdk();

  const [isModalOpen, setModalOpen] = useState(false);
  const [toSlash, setToSlash] = useState("0");
  const [txFee, setTxFee] = useState("0");
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";

  useEffect(() => {
    if (!slashingPercentage || !signingClient) return;

    try {
      const slashingPercentageNumber = parseFloat(slashingPercentage) / 100;
      const toSlash = (
        Decimal.fromUserInput(
          memberEscrow,
          config.coinMap[config.feeToken].fractionalDigits,
        ).toFloatApproximation() * slashingPercentageNumber
      ).toString();

      setToSlash(toSlash);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }, [config.coinMap, config.feeToken, handleError, memberEscrow, signingClient, slashingPercentage]);

  useEffect(() => {
    if (!signingClient) return;

    try {
      const fee = calculateFee(ApContract.GAS_PROPOSE, config.gasPrice);
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
        <AddressTag address={memberToPunish} />
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
          <Text>Escrow to be slashed: </Text>
          <Text>{`${slashingPercentage}% of ${memberEscrow} ${feeTokenDenom} = ${toSlash} ${feeTokenDenom}`}</Text>
        </ConfirmField>
      ) : null}
      {distributionList.length ? (
        <AddressStack gap="s-3">
          <Text>The slashed escrow will be distributed to:</Text>
          <AddressList short addresses={distributionList} addressPrefix={config.addressPrefix} />
        </AddressStack>
      ) : (
        <ConfirmField>
          <Text>The slashed escrow will be burned</Text>
        </ConfirmField>
      )}
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
