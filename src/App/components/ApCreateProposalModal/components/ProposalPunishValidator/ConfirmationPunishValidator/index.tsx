import { Decimal } from "@cosmjs/math";
import { calculateFee } from "@cosmjs/stargate";
import { Typography } from "antd";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import { lazy, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { ApContract } from "utils/arbiterPool";
import { getDisplayAmountFromFee } from "utils/currency";

import { ButtonGroup, ConfirmField, FeeGroup, Heading, Separator, TextComment } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));
const { Text, Paragraph } = Typography;

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
        Decimal.fromUserInput("", config.coinMap[config.feeToken].fractionalDigits).toFloatApproximation() *
        slashingPercentageNumber
      ).toString();

      setToSlash(toSlash);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }, [config.coinMap, config.feeToken, handleError, signingClient, slashingPercentage]);

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
        <Text>Validator(s) to be punished: </Text>
        <b style={{ color: "red" }}>{jail ? "Jailed Forever" : `Jailed until ${jailedUntil}`}</b>
        <br />
        <TextComment>{validatorToPunish}</TextComment>
      </ConfirmField>
      <TextComment>{comment}</TextComment>
      <ConfirmField>
        <Heading>Distribute to: </Heading>
        <Text>None</Text>
      </ConfirmField>
      <ConfirmField>
        <Heading>Returned to User: </Heading>
        <Text>{`${feeTokenDenom}`}</Text>
      </ConfirmField>
      {slashingPercentage && slashingPercentage !== "0" ? (
        <ConfirmField>
          <Heading>Amount to be destroyed: </Heading>
          <Text>{`${slashingPercentage}% of ${""} ${feeTokenDenom} = ${toSlash} ${feeTokenDenom}`}</Text>
        </ConfirmField>
      ) : null}

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
