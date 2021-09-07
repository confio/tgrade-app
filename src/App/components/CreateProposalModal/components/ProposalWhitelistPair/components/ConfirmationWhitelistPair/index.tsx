import { calculateFee } from "@cosmjs/stargate";
import { Typography } from "antd";
import AddressTag from "App/components/AddressTag";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { getDisplayAmountFromFee } from "utils/currency";
import { DsoContract } from "utils/dso";
import { AddressStack, ButtonGroup, FeeGroup, FieldLabel, Separator, TextComment } from "./style";

const { Paragraph } = Typography;

interface ConfirmationWhitelistPairProps {
  readonly pairAddress: string;
  readonly comment: string;
  readonly isSubmitting: boolean;
  readonly goBack: () => void;
  readonly submitForm: () => void;
}

export default function ConfirmationWhitelistPair({
  pairAddress,
  comment,
  isSubmitting,
  goBack,
  submitForm,
}: ConfirmationWhitelistPairProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, signingClient },
  } = useSdk();

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
        <FieldLabel>Pair to be whitelisted</FieldLabel>
        <AddressTag address={pairAddress} />
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
