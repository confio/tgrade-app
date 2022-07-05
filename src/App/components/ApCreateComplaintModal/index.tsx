import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { useState } from "react";

import { ProposalType } from "../ApCreateProposalModal";
import { FormRegisterComplaintValues } from "./components/FormRegisterComplaint";
import FormRegisterComplaint from "./components/FormRegisterComplaint";
import ShowTxResultProposal from "./components/ShowTxResultProposal";
import { ModalHeader, Separator, StyledModal } from "./style";

const { Title, Text } = Typography;
const { Step } = Steps;

interface APoolCreateComplaintModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly refreshComplaints: () => void;
}

export type ProposalStep = { type: ProposalType; confirmation?: true };

function getCurrentStepIndex(step?: ProposalStep): number {
  return step?.confirmation ? 1 : 0;
}

export default function ApCreateComplaintModal({
  isModalOpen,
  closeModal,
  refreshComplaints,
}: APoolCreateComplaintModalProps): JSX.Element {
  const [proposalStep, setProposalStep] = useState<ProposalStep>();
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  function tryAgain() {
    setTxResult(undefined);
  }

  function resetModal() {
    closeModal();
    setSubmitting(false);
    setTxResult(undefined);
    refreshComplaints();
  }

  const [title, setTitle] = useState("");

  async function submitOpenText({ description }: FormRegisterComplaintValues) {
    setTitle(description);
    setProposalStep({ type: ProposalType.OpenText, confirmation: true });
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
            <Steps size="small" current={getCurrentStepIndex(proposalStep)}>
              <Step />
              <Step />
            </Steps>
            {!isSubmitting ? <img alt="Close button" src={closeIcon} onClick={() => closeModal()} /> : null}
          </ModalHeader>
          <Separator />
          <FormRegisterComplaint
            title=""
            description=""
            defendant=""
            goBack={() => setProposalStep(undefined)}
            handleSubmit={submitOpenText}
          />
        </Stack>
      )}
    </StyledModal>
  );
}
