import { Steps, Typography } from "antd";
import * as React from "react";
import { useState } from "react";
import { TxResult } from "../../../../../../components/logic/ShowTxResult";
import closeIcon from "./assets/cross.svg";
import modalBg from "./assets/modal-background.jpg";
import ProposalAddParticipants from "./components/ProposalAddParticipants";
import ProposalAddVotingParticipants from "./components/ProposalAddVotingParticipants";
import ProposalRemoveParticipants from "./components/ProposalRemoveParticipants";
import SelectProposal from "./components/SelectProposal";
import ShowTxResultProposal from "./components/ShowTxResultProposal";
import { ModalHeader, Separator, StyledModal } from "./style";

const { Title } = Typography;
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
        maxWidth: "59.5rem",
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
        <>
          <ModalHeader>
            <Title>{getTitleFromStep(proposalStep)}</Title>
            <Steps current={getCurrentStepIndex(proposalStep)}>
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
        </>
      )}
    </StyledModal>
  );
}
