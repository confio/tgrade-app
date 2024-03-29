import { Decimal } from "@cosmjs/math";
import { Coin } from "@cosmjs/stargate";
import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import Button from "App/components/Button";
import ShowTxResult, { TxResult } from "App/components/ShowTxResult";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useState } from "react";
import { useError, useSdk } from "service";
import { useTokens } from "service/tokens";
import { displayAmountToNative, sendTokens } from "utils/currency";
import { Contract20WS } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { getFormItemName, isValidAddress } from "utils/forms";
import { TokenProps } from "utils/tokens";
import * as Yup from "yup";

import Field from "../Field";
import Stack from "../Stack/style";
import { ButtonGroup, ModalHeader, Separator, StyledModal } from "./style";

const { Title, Text } = Typography;

const amountLabel = "Amount to send";
const recipientLabel = "Recipient address";

interface FormSendTokensValues {
  readonly amount: string;
  readonly recipient: string;
}

interface SendTokenModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly selectedToken?: TokenProps;
}

export default function SendTokenModal({
  isModalOpen,
  closeModal,
  selectedToken,
}: SendTokenModalProps): JSX.Element | null {
  const { handleError } = useError();
  const {
    sdkState: { address, config, signingClient },
  } = useSdk();
  const {
    tokensState: { loadToken },
  } = useTokens();

  const [txResult, setTxResult] = useState<TxResult>();
  const [isSubmitting, setSubmitting] = useState(false);

  if (!selectedToken) return null;

  function resetModal() {
    closeModal();
    setTxResult(undefined);
  }

  async function submitSendTokens({ amount, recipient }: FormSendTokensValues) {
    if (!signingClient || !address || !selectedToken) return;
    setSubmitting(true);

    let doSendTokens: () => Promise<string> = () => Promise.resolve("");

    try {
      if (selectedToken.address === config.feeToken) {
        const nativeAmount = displayAmountToNative(amount, config.coinMap, config.feeToken);
        const nativeCoin: Coin = { denom: config.feeToken, amount: nativeAmount };
        doSendTokens = () => sendTokens(signingClient, address, recipient, nativeCoin);
      } else {
        const nativeAmount = Decimal.fromUserInput(amount, selectedToken.decimals).atomics;
        doSendTokens = () =>
          Contract20WS.sendTokens(signingClient, address, selectedToken.address, recipient, nativeAmount);
      }

      const txHash = await doSendTokens();

      setTxResult({
        msg: `${amount} ${selectedToken.symbol} sent to ${recipient}. Transaction ID: ${txHash}`,
      });
      await loadToken?.(selectedToken.address);
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

  const validationSchema = Yup.object().shape({
    [getFormItemName(amountLabel)]: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .positive("Amount must be positive")
      .max(parseFloat(selectedToken.humanBalance), "Amount must not exceed current balance"),
    [getFormItemName(recipientLabel)]: Yup.string()
      .typeError("Recipient address must be alphanumeric")
      .required("Recipient address is required")
      .test(
        "is-address-valid",
        "Recipient address must be valid",
        (recipientAddress) => !recipientAddress || isValidAddress(recipientAddress, config.addressPrefix),
      ),
  });

  return (
    <StyledModal
      centered
      footer={null}
      closable={false}
      visible={isModalOpen}
      width="100%"
      bgTransparent={!!txResult}
      style={{
        right: "-40px",
        maxWidth: "40rem",
        paddingRight: "60px",
      }}
      bodyStyle={{
        position: "relative",
        padding: "var(--s1)",
        borderRadius: "16px",
        backgroundColor: "var(--bg-body)",
      }}
      maskStyle={{ background: "rgba(26, 29, 38,0.6)" }}
    >
      {txResult ? (
        <ShowTxResult {...txResult}>
          {txResult.error ? (
            <Button onClick={() => setTxResult(undefined)}>
              <span>Try again</span>
            </Button>
          ) : null}
          <Button onClick={() => resetModal()}>
            <span data-cy="wallet-dialog-send-token-modal-go-to-wallet-button">Go to Wallet</span>
          </Button>
        </ShowTxResult>
      ) : (
        <Stack gap="s1">
          <ModalHeader>
            <Stack gap="s1">
              <Title>Send tokens</Title>
              <Text>
                Balance:{" "}
                <span data-cy="wallet-dialog-send-token-modal-balance-value">
                  {selectedToken.humanBalance}
                </span>
                <span data-cy="wallet-dialog-send-token-modal-token-name">&nbsp;{selectedToken.symbol}</span>
              </Text>
            </Stack>
            {!isSubmitting ? <img alt="Close button" src={closeIcon} onClick={() => resetModal()} /> : null}
          </ModalHeader>
          <Formik
            initialValues={{
              [getFormItemName(amountLabel)]: "",
              [getFormItemName(recipientLabel)]: "",
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values) =>
              submitSendTokens({
                amount: values[getFormItemName(amountLabel)],
                recipient: values[getFormItemName(recipientLabel)],
              })
            }
          >
            {({ isValid, submitForm }) => (
              <Form>
                <Stack gap="s1">
                  <Field label={amountLabel} placeholder="Enter amount" />
                  <Field label={recipientLabel} placeholder="Enter address" />
                  <Separator />
                  <ButtonGroup>
                    <Button
                      style={{ background: "var(--bg-button-1ary)", border: "none" }}
                      loading={isSubmitting}
                      disabled={!isValid}
                      onClick={() => submitForm()}
                      data-cy="wallet-dialog-send-token-modal-send-token-button"
                    >
                      Send tokens
                    </Button>
                  </ButtonGroup>
                </Stack>
              </Form>
            )}
          </Formik>
        </Stack>
      )}
    </StyledModal>
  );
}
