import { Typography } from "antd";
import Steps from "App/components/form/Steps";
import { Stack } from "App/components/layout";
import { TxResult } from "App/components/logic/ShowTxResult";
import * as React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDso } from "service";
import { DsoHomeParams } from "../..";
import closeIcon from "./assets/cross.svg";
import modalBg from "./assets/modal-background.jpg";
import ProposalAddParticipants from "./components/ProposalAddParticipants";
import ProposalAddVotingParticipants from "./components/ProposalAddVotingParticipants";
import ProposalRemoveParticipants from "./components/ProposalRemoveParticipants";
import SelectProposal from "./components/SelectProposal";
import ShowTxResultProposal from "./components/ShowTxResultProposal";
import { ModalHeader, Separator, StyledModal } from "./style";

const { Title, Text } = Typography;
const { Step } = Steps;

export enum ProposalType {
  AddParticipants = "add-participants",
  RemoveParticipants = "remove-participants",
  AddVotingParticipants = "add-voting-participants",
}

export const proposalLabels = {
  [ProposalType.AddParticipants]: "Add non voting participants",
  [ProposalType.RemoveParticipants]: "Remove non voting participants",
  [ProposalType.AddVotingParticipants]: "Add voting participants",
};

export const proposalTitles = {
  newProposal: "New proposal",
  [ProposalType.AddParticipants]: "Add participant(s)",
  [ProposalType.RemoveParticipants]: "Remove participant(s)",
  [ProposalType.AddVotingParticipants]: "Add voting participant(s)",
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

interface CreateProposalModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
}

export default function CreateProposalModal({
  isModalOpen,
  closeModal,
}: CreateProposalModalProps): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const {
    dsoState: { dsos },
  } = useDso();
  const [proposalStep, setProposalStep] = useState<ProposalStep>();
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  const [, dsoName = "DSO"] = dsos.find(([address]) => address === dsoAddress) ?? [];

  function tryAgain() {
    setProposalStep(proposalStep ? { type: proposalStep.type } : undefined);
    setTxResult(undefined);
  }

  function resetModal() {
    closeModal();
    setProposalStep(undefined);
    setSubmitting(false);
    setTxResult(undefined);
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
        maxWidth: "63.25rem",
        paddingRight: "60px",
      }}
      bodyStyle={{
        position: "relative",
        padding: "var(--s1)",
        backgroundColor: txResult ? "transparent" : "var(--bg-body)",
      }}
      maskStyle={{
        background: `linear-gradient(0deg, rgba(4, 119, 120, 0.9), rgba(4, 119, 120, 0.9)), url(${modalBg})`,
        backgroundSize: "cover",
      }}
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
              <Text>{dsoName}</Text>
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
          ) : proposalStep.type === ProposalType.AddParticipants ? (
            <ProposalAddParticipants
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.RemoveParticipants ? (
            <ProposalRemoveParticipants
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.AddVotingParticipants ? (
            <ProposalAddVotingParticipants
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
