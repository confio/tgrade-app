import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import Button from "App/components/Button";
import Field from "App/components/Field";
import ShowTxResult, { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import { DsoHomeParams } from "App/pages/DsoHome";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { lazy, useState } from "react";
import { useParams } from "react-router-dom";
import { getDsoName, useDso, useError, useSdk } from "service";
import { displayAmountToNative } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { getFormItemName } from "utils/forms";
import { TcContract } from "utils/trustedCircle";
import * as Yup from "yup";

import BackButtonOrLink from "../BackButtonOrLink";
import { ButtonGroup, ModalHeader, Separator, StyledModal } from "./style";

const ConnectWalletModal = lazy(() => import("../ConnectWalletModal"));
const { Title, Text } = Typography;

const escrowAmountLabel = "Escrow amount";

const validationSchema = Yup.object().shape({
  [getFormItemName(escrowAmountLabel)]: Yup.number()
    .typeError("Escrow amount must be a number")
    .positive("Escrow amount must be positive"),
});

interface FormDepositEscrowValues {
  readonly escrowAmount: string;
}

interface DepositDsoEscrowModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly requiredEscrow: string;
  readonly userEscrow: string;
  readonly refreshEscrows: () => Promise<void>;
}

export default function DepositDsoEscrowModal({
  isModalOpen,
  closeModal,
  requiredEscrow,
  userEscrow,
  refreshEscrows,
}: DepositDsoEscrowModalProps): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { config, signer, address, signingClient },
  } = useSdk();
  const feeDenom = config.coinMap[config.feeToken].denom;
  const {
    dsoState: { dsos },
  } = useDso();

  const [isConnectWalletModalOpen, setConnectWalletModalOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  const dsoName = getDsoName(dsos, dsoAddress);

  function resetModal() {
    closeModal();
    setTxResult(undefined);
    refreshEscrows();
  }

  async function submitDepositEscrow({ escrowAmount }: FormDepositEscrowValues) {
    if (!signingClient || !address) return;
    setSubmitting(true);

    const nativeEscrow = displayAmountToNative(escrowAmount, config.coinMap, config.feeToken);

    try {
      const dsoContract = new TcContract(dsoAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.depositEscrow(address, [
        { denom: config.feeToken, amount: nativeEscrow },
      ]);

      setTxResult({
        msg: `Deposited escrow ${escrowAmount}${config.feeToken} in ${dsoName} (${dsoAddress}). Transaction ID: ${transactionHash}`,
      });
      refreshEscrows();
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <StyledModal
      centered
      footer={null}
      closable={false}
      visible={isModalOpen}
      destroyOnClose
      width="100%"
      bgTransparent={!!txResult}
      style={{
        right: "-40px",
        maxWidth: "63.25rem",
        paddingRight: "60px",
      }}
      bodyStyle={{
        position: "relative",
        padding: "var(--s1)",
        borderRadius: "16px",
        backgroundColor: "var(--bg-body)",
      }}
      maskStyle={{ background: txResult ? "rgba(26, 29, 38,0.9)" : "rgba(26, 29, 38,0.6)" }}
    >
      {txResult ? (
        <ShowTxResult {...txResult}>
          {txResult.error ? (
            <Button onClick={() => setTxResult(undefined)}>
              <span>Try again</span>
            </Button>
          ) : null}
          <Button onClick={() => resetModal()}>
            <span>Go to Trusted Circle details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <Stack gap="s1">
          <ModalHeader>
            <Stack gap="s1">
              <Title>Deposit escrow in "{dsoName}"?</Title>
              <Text>
                Required escrow: {requiredEscrow} {feeDenom}
              </Text>
              <Text>
                Your current escrow: {userEscrow} {feeDenom}
              </Text>
            </Stack>
            {!isSubmitting ? <img alt="Close button" src={closeIcon} onClick={() => closeModal()} /> : null}
          </ModalHeader>
          <Separator />
          <Formik
            initialValues={{
              [getFormItemName(escrowAmountLabel)]: "0",
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values) =>
              submitDepositEscrow({ escrowAmount: values[getFormItemName(escrowAmountLabel)] })
            }
          >
            {({ values, isValid, submitForm }) => (
              <Form>
                <Stack gap="s1">
                  <Field label={escrowAmountLabel} placeholder="Enter amount" units="TGD" />
                  <Separator />
                  <ButtonGroup>
                    <BackButtonOrLink text={"Back"} onClick={() => closeModal()} />
                    <Button
                      style={{ backgroundColor: "#0BB0B1", border: "none" }}
                      loading={isSubmitting}
                      disabled={!isValid}
                      danger={!!signer}
                      onClick={signer ? () => submitForm() : () => setConnectWalletModalOpen(true)}
                    >
                      {signer ? "Pay escrow" : "Connect wallet"}
                    </Button>
                  </ButtonGroup>
                </Stack>
              </Form>
            )}
          </Formik>
        </Stack>
      )}
      <ConnectWalletModal
        isModalOpen={isConnectWalletModalOpen}
        closeModal={() => setConnectWalletModalOpen(false)}
      />
    </StyledModal>
  );
}
