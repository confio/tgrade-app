import { calculateFee } from "@cosmjs/stargate";
import { Typography } from "antd";
import AddressList from "App/components/AddressList";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import ConnectWalletModal from "App/components/ConnectWalletModal";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { getDisplayAmountFromFee } from "utils/currency";
import { DsoContract } from "utils/dso";
import { AddressStack, ButtonGroup, FeeGroup, Separator, TextComment } from "./style";

const { Text, Paragraph } = Typography;

interface ConfirmationAddVotingParticipantsProps {
  readonly members: readonly string[];
  readonly comment: string;
  readonly isSubmitting: boolean;
  readonly goBack: () => void;
  readonly submitForm: () => void;
}

export default function ConfirmationAddVotingParticipants({
  members,
  comment,
  isSubmitting,
  goBack,
  submitForm,
}: ConfirmationAddVotingParticipantsProps): JSX.Element {
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
      <AddressStack gap="s-3">
        <Text>Voting participant(s) to be added</Text>
        <AddressList addresses={members} addressPrefix={config.addressPrefix} />
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
