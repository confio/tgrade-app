import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { useState } from "react";
import { useError, useSdk } from "service";
import { ApContract, Complaint } from "utils/arbiterPool";
import { getErrorFromStackTrace } from "utils/errors";

import ConfirmationRegisterComplaint from "./components/ConfirmationRegisterComplaint";
import FormRegisterComplaint, { FormRegisterComplaintValues } from "./components/FormRegisterComplaint";
import ShowTxResultProposal from "./components/ShowTxResultProposal";
import { ModalHeader, Separator, StyledModal } from "./style";

const { Title, Text } = Typography;
const { Step } = Steps;

export type ComplaintToRegister = Pick<Complaint, "title" | "description" | "defendant">;

interface ApRegisterComplaintModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly refreshComplaints: () => void;
}

export default function ApRegisterComplaintModal({
  isModalOpen,
  closeModal,
  refreshComplaints,
}: ApRegisterComplaintModalProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, signingClient, address },
  } = useSdk();

  const [isConfirmationStep, setConfirmationStep] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  const [complaint, setComplaint] = useState<ComplaintToRegister>({
    title: "",
    description: "",
    defendant: "",
  });

  function tryAgain() {
    setConfirmationStep(false);
    setTxResult(undefined);
  }

  function resetModal() {
    closeModal();
    setConfirmationStep(false);
    setSubmitting(false);
    setTxResult(undefined);
    refreshComplaints();
  }

  function submitRegisterForm({ title, description, defendant }: FormRegisterComplaintValues) {
    setComplaint({ title, description, defendant });
    setConfirmationStep(true);
  }

  async function submitRegisterConfirmation() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const apContract = new ApContract(config, signingClient);
      const txHash = await apContract.registerComplaint(
        address,
        complaint.title,
        complaint.description,
        complaint.defendant,
      );

      setTxResult({
        msg: `Registered complaint to Arbiter Pool. Transaction ID: ${txHash}`,
      });
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
      maskStyle={{ background: "rgba(26, 29, 38,0.6)" }}
    >
      {txResult ? (
        <ShowTxResultProposal
          txResult={txResult}
          setTxResult={setTxResult}
          tryAgain={tryAgain}
          resetModal={resetModal}
        />
      ) : (
        <Stack gap="s1">
          <ModalHeader>
            <Typography>
              <Title>Register Complaint</Title>
              <Text>Arbiter Pool</Text>
            </Typography>
            <Steps size="small" current={isConfirmationStep ? 1 : 0}>
              <Step />
              <Step />
            </Steps>
            {!isSubmitting ? <img alt="Close button" src={closeIcon} onClick={() => closeModal()} /> : null}
          </ModalHeader>
          <Separator />
          {!isConfirmationStep ? (
            <FormRegisterComplaint
              title={complaint.title}
              description={complaint.description}
              defendant={complaint.defendant}
              handleSubmit={submitRegisterForm}
            />
          ) : (
            <ConfirmationRegisterComplaint
              complaint={complaint}
              isSubmitting={isSubmitting}
              goBack={() => setConfirmationStep(false)}
              submitForm={submitRegisterConfirmation}
            />
          )}
        </Stack>
      )}
    </StyledModal>
  );
}
