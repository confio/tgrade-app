import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { lazy, useState } from "react";
import { useParams } from "react-router-dom";
import { getDsoName, useDso } from "service";

import { DsoHomeParams } from "../../pages/DsoHome";
import SelectProposal from "./components/SelectProposal";
import ShowTxResultProposal from "./components/ShowTxResultProposal";
import { ModalHeader, Separator, StyledModal } from "./style";

const ProposalAddParticipants = lazy(() => import("./components/ProposalAddParticipants"));
const ProposalRemoveParticipants = lazy(() => import("./components/ProposalRemoveParticipants"));
const ProposalAddVotingParticipants = lazy(() => import("./components/ProposalAddVotingParticipants"));
const ProposalPunishVotingParticipant = lazy(() => import("./components/ProposalPunishVotingParticipant"));
const ProposalEditDso = lazy(() => import("./components/ProposalEditDso"));
const ProposalWhitelistPair = lazy(() => import("./components/ProposalWhitelistPair"));

const { Title, Text } = Typography;
const { Step } = Steps;

export enum ProposalType {
  AddParticipants = "add-participants",
  RemoveParticipants = "remove-participants",
  AddVotingParticipants = "add-voting-participants",
  PunishVotingParticipant = "punish-voting-participants",
  EditDso = "edit-dso",
  WhitelistPair = "whitelist-pair",
}

export const proposalLabels = {
  [ProposalType.AddParticipants]: "Add non voting participants",
  [ProposalType.RemoveParticipants]: "Remove non voting participants",
  [ProposalType.AddVotingParticipants]: "Add voting participants",
  [ProposalType.PunishVotingParticipant]: "Punish voting participant",
  [ProposalType.EditDso]: "Edit Trusted Circle",
  [ProposalType.WhitelistPair]: "Whitelist Pair",
};

export const proposalTitles = {
  newProposal: "New proposal",
  [ProposalType.AddParticipants]: "Add participant(s)",
  [ProposalType.RemoveParticipants]: "Remove participant(s)",
  [ProposalType.AddVotingParticipants]: "Add voting participant(s)",
  [ProposalType.PunishVotingParticipant]: "Punish voting participant",
  [ProposalType.EditDso]: "Edit Trusted Circle",
  [ProposalType.WhitelistPair]: "Whitelist Pair",
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

interface DsoCreateProposalModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly refreshProposals: () => void;
}

export default function DsoCreateProposalModal({
  isModalOpen,
  closeModal,
  refreshProposals,
}: DsoCreateProposalModalProps): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const {
    dsoState: { dsos },
  } = useDso();
  const [proposalStep, setProposalStep] = useState<ProposalStep>();
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  const dsoName = getDsoName(dsos, dsoAddress);

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
          ) : proposalStep.type === ProposalType.PunishVotingParticipant ? (
            <ProposalPunishVotingParticipant
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.EditDso ? (
            <ProposalEditDso
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.WhitelistPair ? (
            <ProposalWhitelistPair
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
