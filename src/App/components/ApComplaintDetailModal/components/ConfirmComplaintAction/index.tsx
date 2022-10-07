import { calculateFee } from "@cosmjs/stargate";
import { Typography } from "antd";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import { lazy, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { ApContract } from "utils/arbiterPool";
import { getDisplayAmountFromFee } from "utils/currency";

import { ComplaintAction, ComplaintActionStep, complaintActionTitles } from "../..";
import { ButtonGroup, ConfirmField, FeeGroup, Separator } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));
const { Text, Paragraph } = Typography;

function getGasFromStep(complaintActionStep: ComplaintActionStep): number {
  switch (complaintActionStep.type) {
    case ComplaintAction.AcceptComplaint:
      return ApContract.GAS_ACCEPT_COMPLAINT;
    case ComplaintAction.WithdrawComplaint:
      return ApContract.GAS_WITHDRAW_COMPLAINT;
    default:
      return ApContract.GAS_EXECUTE;
  }
}

interface ConfirmComplaintActionProps {
  readonly complaintActionStep: ComplaintActionStep;
  readonly reason: string;
  readonly isSubmitting: boolean;
  readonly goBack: () => void;
  readonly submitForm: () => void;
}

export default function ConfirmComplaintAction({
  complaintActionStep,
  reason,
  isSubmitting,
  goBack,
  submitForm,
}: ConfirmComplaintActionProps): JSX.Element | null {
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
      const fee = calculateFee(getGasFromStep(complaintActionStep), config.gasPrice);
      const txFee = getDisplayAmountFromFee(fee, config);
      setTxFee(txFee);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }, [complaintActionStep, config, handleError, signingClient]);

  if (!complaintActionStep.confirmation) return null;

  return (
    <>
      {complaintActionStep.type === ComplaintAction.WithdrawComplaint ? (
        <ConfirmField>
          <Text>Reason: </Text>
          <Text>{reason}</Text>
        </ConfirmField>
      ) : null}
      {complaintActionStep.type !== ComplaintAction.AcceptComplaint ? <Separator /> : null}
      <ButtonGroup>
        <BackButtonOrLink disabled={isSubmitting} onClick={() => goBack()} text="Back" />
        <FeeGroup>
          <Typography>
            <Paragraph>Tx fee</Paragraph>
            <Paragraph>{`~${txFee} ${feeTokenDenom}`}</Paragraph>
          </Typography>
          <Button loading={isSubmitting} onClick={signer ? () => submitForm() : () => setModalOpen(true)}>
            <div>
              {signer ? `Confirm ${complaintActionTitles[complaintActionStep.type]}` : "Connect wallet"}
            </div>
          </Button>
        </FeeGroup>
      </ButtonGroup>
      <ConnectWalletModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </>
  );
}
