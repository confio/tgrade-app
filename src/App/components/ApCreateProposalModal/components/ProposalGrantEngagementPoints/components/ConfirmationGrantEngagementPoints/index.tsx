import { calculateFee } from "@cosmjs/stargate";
import { Typography } from "antd";
import AddressTag from "App/components/AddressTag";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import { lazy, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { ApContract } from "utils/arbiterPool";
import { getDisplayAmountFromFee } from "utils/currency";

import { ButtonGroup, ConfirmField, FeeGroup, Separator, TextComment } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));
const { Text, Paragraph } = Typography;

interface ConfirmationGrantEngagementPointsProps {
  readonly member: string;
  readonly points: string;
  readonly comment: string;
  readonly isSubmitting: boolean;
  readonly goBack: () => void;
  readonly submitForm: () => void;
}

export default function ConfirmationGrantEngagementPoints({
  member,
  points,
  comment,
  isSubmitting,
  goBack,
  submitForm,
}: ConfirmationGrantEngagementPointsProps): JSX.Element {
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
        <Text>Member to be granted Engagement Points: </Text>
        <AddressTag address={member} />
      </ConfirmField>
      <ConfirmField>
        <Text>Number of Engagement Points to be granted: </Text>
        <Text>{points}</Text>
      </ConfirmField>
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
