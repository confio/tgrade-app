import { Typography } from "antd";
import { AddressList, Button } from "App/components/form";
import { BackButtonOrLink } from "App/components/logic";
import * as React from "react";
import { useError, useSdk } from "service";
import { getDisplayAmountFromFee } from "utils/currency";
import { AddressStack, ButtonGroup, FeeGroup, Separator, TextComment } from "./style";

const { Text, Paragraph } = Typography;

interface ConfirmationRemoveParticipantsProps {
  readonly members: readonly string[];
  readonly comment: string;
  readonly isSubmitting: boolean;
  readonly goBack: () => void;
  readonly submitForm: () => void;
}

export default function ConfirmationRemoveParticipants({
  members,
  comment,
  isSubmitting,
  goBack,
  submitForm,
}: ConfirmationRemoveParticipantsProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, signingClient },
  } = useSdk();

  const [txFee, setTxFee] = React.useState("0");
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";

  React.useEffect(() => {
    try {
      const txFee = getDisplayAmountFromFee(signingClient.fees.exec, config);
      setTxFee(txFee);
    } catch (error) {
      handleError(error);
    }
  }, [config, handleError, signingClient.fees.exec]);

  return (
    <>
      <AddressStack gap="s-3">
        <Text>Non voting participant(s) to be removed</Text>
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
