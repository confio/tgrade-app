import { calculateFee } from "@cosmjs/stargate";
import { Typography } from "antd";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import { lazy, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { getDisplayAmountFromFee } from "utils/currency";
import { ValidatorVotingContract } from "utils/validatorVoting";

import { ButtonGroup, ConfirmField, FeeGroup, Separator, TextComment } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));
const { Text, Paragraph } = Typography;

interface ConfirmationUpdateConsensusEvidenceParamsProps {
  readonly maxAgeNumBlocks: string;
  readonly maxAgeDuration: string;
  readonly maxBytes: string;
  readonly comment: string;
  readonly isSubmitting: boolean;
  readonly goBack: () => void;
  readonly submitForm: () => void;
}

export default function ConfirmationUpdateConsensusEvidenceParams({
  maxAgeNumBlocks,
  maxAgeDuration,
  maxBytes,
  comment,
  isSubmitting,
  goBack,
  submitForm,
}: ConfirmationUpdateConsensusEvidenceParamsProps): JSX.Element {
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
      const fee = calculateFee(ValidatorVotingContract.GAS_PROPOSE, config.gasPrice);
      const txFee = getDisplayAmountFromFee(fee, config);
      setTxFee(txFee);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }, [config, handleError, signingClient]);

  return (
    <>
      {maxAgeNumBlocks ? (
        <ConfirmField>
          <Text>Maximum age of evidence (blocks): </Text>
          <Text>{maxAgeNumBlocks}</Text>
        </ConfirmField>
      ) : null}
      {maxAgeDuration ? (
        <ConfirmField>
          <Text>Maximum age of evidence (seconds): </Text>
          <Text>{maxAgeDuration}</Text>
        </ConfirmField>
      ) : null}
      {maxBytes ? (
        <ConfirmField>
          <Text>Maximum bytes: </Text>
          <Text>{maxBytes}</Text>
        </ConfirmField>
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
