import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { lazy, useState } from "react";

import SelectProposal from "./components/SelectProposal";
import ShowTxResultProposal from "./components/ShowTxResultProposal";
import { ModalHeader, Separator, StyledModal } from "./style";

const ProposalSendTokens = lazy(() => import("./components/ProposalSendTokens"));
const ProposalOpenText = lazy(() => import("./components/ProposalOpenText"));

const { Title, Text } = Typography;
const { Step } = Steps;

export enum ProposalType {
  SendTokens = "send-tokens",
  OpenText = "open-text",
}

export const proposalLabels = {
  [ProposalType.SendTokens]: "Send tokens",
  [ProposalType.OpenText]: "Open text proposal",
};

export const proposalTitles = {
  newProposal: "New proposal",
  ...proposalLabels,
  confirmation: "Confirmation",
};

export type ProposalStep = { type: ProposalType; confirmation?: true };

function getTitleFromStep(step?: ProposalStep): string {
  return step?.confirmation
    ? proposalTitles.confirmation
    : step
    ? proposalTitles[step.type]
    : proposalTitles.newProposal;
}

function getCurrentStepIndex(step?: ProposalStep): number {
  return step?.confirmation ? 2 : step?.type ? 1 : 0;
}

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
  const [proposalStep, setProposalStep] = useState<ProposalStep>();
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  function tryAgain() {
    setProposalStep(proposalStep ? { type: proposalStep.type } : undefined);
    setTxResult(undefined);
  }

  function resetModal() {
    closeModal();
    setProposalStep(undefined);
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
              <Title>{getTitleFromStep(proposalStep)}</Title>
              <Text>Community Pool</Text>
            </Typography>
            <Steps size="small" current={getCurrentStepIndex(proposalStep)}>
              <Step />
              <Step />
              <Step />
            </Steps>
            {!isSubmitting ? <img alt="Close button" src={closeIcon} onClick={() => closeModal()} /> : null}
          </ModalHeader>
          <Separator />
          {!proposalStep ? (
            <SelectProposal setProposalStep={setProposalStep} />
          ) : proposalStep.type === ProposalType.SendTokens ? (
            <ProposalSendTokens
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.OpenText ? (
            <ProposalOpenText
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : null}
        </Stack>
      )}
    </StyledModal>
  );
}
