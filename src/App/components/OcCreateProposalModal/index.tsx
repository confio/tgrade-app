import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { lazy, useState } from "react";

import SelectProposal from "./components/SelectProposal";
import ShowTxResultProposal from "./components/ShowTxResultProposal";
import { ModalHeader, Separator, StyledModal } from "./style";

const ProposalAddOCMembers = lazy(() => import("./components/ProposalAddOCMembers"));
const ProposalPunishOCMember = lazy(() => import("./components/ProposalPunishOCMember"));
const ProposalGrantEngagementPoints = lazy(() => import("./components/ProposalGrantEngagementPoints"));
const ProposalPunishValidator = lazy(() => import("./components/ProposalPunishValidator"));
const ProposalUnjailValidator = lazy(() => import("./components/ProposalUnjailValidator"));

const { Title, Text } = Typography;
const { Step } = Steps;

export enum ProposalType {
  AddOCMembers = "add-oc-members",
  PunishOCMember = "punish-oc-member",
  GrantEngagementPoints = "grant-engagement-points",
  PunishValidator = "punish-validator",
  UnjailValidator = "unjail-validator",
}

export const proposalLabels = {
  [ProposalType.AddOCMembers]: "Add Oversight Community members",
  [ProposalType.PunishOCMember]: "Punish Oversight Community member",
  [ProposalType.GrantEngagementPoints]: "Grant Engagement Points",
  [ProposalType.PunishValidator]: "Punish Validator",
  [ProposalType.UnjailValidator]: "Unjail Validator",
};

export const proposalTitles = {
  newProposal: "New proposal",
  [ProposalType.AddOCMembers]: "Add Oversight Community members",
  [ProposalType.PunishOCMember]: "Punish Oversight Community member",
  [ProposalType.GrantEngagementPoints]: "Grant Engagement Points",
  [ProposalType.PunishValidator]: "Punish Validator",
  [ProposalType.UnjailValidator]: "Unjail Validator",
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

interface OcCreateProposalModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly refreshProposals: () => void;
}

export default function OcCreateProposalModal({
  isModalOpen,
  closeModal,
  refreshProposals,
}: OcCreateProposalModalProps): JSX.Element {
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
              <Title>{getTitleFromStep(proposalStep)}</Title>
              <Text>Oversight Community</Text>
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
          ) : proposalStep.type === ProposalType.AddOCMembers ? (
            <ProposalAddOCMembers
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.PunishOCMember ? (
            <ProposalPunishOCMember
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.GrantEngagementPoints ? (
            <ProposalGrantEngagementPoints
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.PunishValidator ? (
            <ProposalPunishValidator
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.UnjailValidator ? (
            <ProposalUnjailValidator
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
