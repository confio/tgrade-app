import { Typography } from "antd";
import Button from "App/components/Button";
import AddressList from "App/components/AddressList";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import * as React from "react";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { getDisplayAmountFromFee } from "utils/currency";
import { AddressStack, ButtonGroup, FeeGroup, Separator, TextComment } from "./style";

const { Text, Paragraph } = Typography;

interface ConfirmationAddParticipantsProps {
  readonly members: readonly string[];
  readonly comment: string;
  readonly isSubmitting: boolean;
  readonly goBack: () => void;
  readonly submitForm: () => void;
}

export default function ConfirmationAddParticipants({
  members,
  comment,
  isSubmitting,
  goBack,
  submitForm,
}: ConfirmationAddParticipantsProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, signingClient },
  } = useSdk();

  const [txFee, setTxFee] = useState("0");
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";

  useEffect(() => {
    if (!signingClient) return;

    try {
      const txFee = getDisplayAmountFromFee(signingClient.fees.exec, config);
      setTxFee(txFee);
    } catch (error) {
      handleError(error);
    }
  }, [config, handleError, signingClient]);

  return (
    <>
      <AddressStack gap="s-3">
        <Text>Non voting participant(s) to be added</Text>
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
          <Button loading={isSubmitting} onClick={() => submitForm()}>
            <div>Confirm proposal</div>
          </Button>
        </FeeGroup>
      </ButtonGroup>
    </>
  );
}
