import { calculateFee } from "@cosmjs/stargate";
import { Typography } from "antd";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import ConnectWalletModal from "App/components/ConnectWalletModal";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { getDisplayAmountFromFee } from "utils/currency";
import { DsoContract } from "utils/dso";
import {
  ButtonGroup,
  ChangedField,
  FeeGroup,
  FieldGroup,
  Separator,
  TextComment,
  TextLabel,
  TextValue,
} from "./style";

const { Paragraph } = Typography;

interface ConfirmationEditDsoProps {
  readonly isSubmitting: boolean;
  readonly goBack: () => void;
  readonly submitForm: () => void;
  readonly dsoName?: string;
  readonly quorum?: string;
  readonly threshold?: string;
  readonly votingDuration?: string;
  readonly escrowAmount?: string;
  readonly earlyPass?: boolean;
  readonly comment: string;
}

export default function ConfirmationEditDso({
  isSubmitting,
  goBack,
  submitForm,
  dsoName,
  quorum,
  threshold,
  votingDuration,
  escrowAmount,
  earlyPass,
  comment,
}: ConfirmationEditDsoProps): JSX.Element {
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
      handleError(error);
    }
  }, [config, handleError, signingClient]);

  return (
    <>
      <FieldGroup>
        {dsoName ? (
          <ChangedField>
            <TextLabel>Trusted Circle name</TextLabel>
            <TextValue>{dsoName}</TextValue>
          </ChangedField>
        ) : null}
        {quorum ? (
          <ChangedField>
            <TextLabel>Quorum</TextLabel>
            <TextValue>{quorum} %</TextValue>
          </ChangedField>
        ) : null}
        {threshold ? (
          <ChangedField>
            <TextLabel>Threshold</TextLabel>
            <TextValue>{threshold} %</TextValue>
          </ChangedField>
        ) : null}
        {votingDuration ? (
          <ChangedField>
            <TextLabel>Voting duration</TextLabel>
            <TextValue>{votingDuration}</TextValue>
          </ChangedField>
        ) : null}
        {escrowAmount ? (
          <ChangedField>
            <TextLabel>Escrow amount</TextLabel>
            <TextValue>{escrowAmount}</TextValue>
          </ChangedField>
        ) : null}
        {earlyPass !== undefined ? (
          <ChangedField>
            <TextLabel>Early pass</TextLabel>
            <TextValue>{earlyPass ? "Enabled" : "Disabled"}</TextValue>
          </ChangedField>
        ) : null}
      </FieldGroup>
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
