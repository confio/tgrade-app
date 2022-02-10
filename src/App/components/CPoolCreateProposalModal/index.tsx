import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { lazy, useState } from "react";

import ShowTxResultProposal from "./components/ShowTxResultProposal";
import { ModalHeader, Separator, StyledModal } from "./style";

const ProposalSendTokens = lazy(() => import("./components/ProposalSendTokens"));
const { Title, Text } = Typography;
const { Step } = Steps;

interface CPoolCreateProposalModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly refreshProposals: () => void;
}

export default function CPoolCreateProposalModal({
  isModalOpen,
  closeModal,
  refreshProposals,
}: CPoolCreateProposalModalProps): JSX.Element {
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  function tryAgain() {
    setConfirmationStep(false);
    setTxResult(undefined);
  }

  function resetModal() {
    closeModal();
    setConfirmationStep(false);
    setSubmitting(false);
    setTxResult(undefined);
    refreshProposals();
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
        backgroundColor: txResult ? "transparent" : "var(--bg-body)",
      }}
      maskStyle={{ background: txResult ? "rgba(4,119,120,0.9)" : "rgba(4,119,120,0.6)" }}
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
              <Title>{confirmationStep ? "Confirmation" : "Send tokens"}</Title>
              <Text>Community Pool</Text>
            </Typography>
            <Steps size="small" current={confirmationStep ? 1 : 0}>
              <Step />
              <Step />
            </Steps>
            {!isSubmitting ? <img alt="Close button" src={closeIcon} onClick={() => closeModal()} /> : null}
          </ModalHeader>
          <Separator />
          <ProposalSendTokens
            confirmationStep={confirmationStep}
            setConfirmationStep={setConfirmationStep}
            isSubmitting={isSubmitting}
            setSubmitting={setSubmitting}
            setTxResult={setTxResult}
          />
        </Stack>
      )}
    </StyledModal>
  );
}
