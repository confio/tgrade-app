import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { lazy, useState } from "react";

import ProposalOpenText from "./components/ProposalOpenText";
import SelectProposal from "./components/SelectProposal";
import ShowTxResultProposal from "./components/ShowTxResultProposal";
import { ModalHeader, Separator, StyledModal } from "./style";

const ProposalRegisterUpgrade = lazy(() => import("./components/ProposalRegisterUpgrade"));
const ProposalCancelUpgrade = lazy(() => import("./components/ProposalCancelUpgrade"));
const ProposalPinCodes = lazy(() => import("./components/ProposalPinCodes"));
const ProposalUnpinCodes = lazy(() => import("./components/ProposalUnpinCodes"));
const ProposalUpdateConsensusBlockParams = lazy(
  () => import("./components/ProposalUpdateConsensusBlockParams"),
);
const ProposalUpdateConsensusEvidenceParams = lazy(
  () => import("./components/ProposalUpdateConsensusEvidenceParams"),
);
const ProposalMigrateContract = lazy(() => import("./components/ProposalMigrateContract"));

const { Title } = Typography;
const { Step } = Steps;

export enum ProposalType {
  RegisterUpgrade = "register-upgrade",
  CancelUpgrade = "cancel-upgrade",
  PinCodes = "pin-codes",
  UnpinCodes = "unpin-codes",
  UpdateConsensusBlockParams = "update-consensus-block-params",
  UpdateConsensusEvidenceParams = "update-consensus-evidence-params",
  MigrateContract = "migrate-contract",
  OpenText = "open-text",
}

export const proposalLabels = {
  [ProposalType.RegisterUpgrade]: "Register upgrade",
  [ProposalType.CancelUpgrade]: "Cancel upgrade",
  [ProposalType.PinCodes]: "Pin codes",
  [ProposalType.UnpinCodes]: "Unpin codes",
  [ProposalType.UpdateConsensusBlockParams]: "Update consensus block parameters",
  [ProposalType.UpdateConsensusEvidenceParams]: "Update consensus evidence parameters",
  [ProposalType.MigrateContract]: "Migrate contract",
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

interface ValidatorCreateProposalModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly refreshProposals: () => void;
}

export default function ValidatorCreateProposalModal({
  isModalOpen,
  closeModal,
  refreshProposals,
}: ValidatorCreateProposalModalProps): JSX.Element {
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
          ) : proposalStep.type === ProposalType.RegisterUpgrade ? (
            <ProposalRegisterUpgrade
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.CancelUpgrade ? (
            <ProposalCancelUpgrade
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.PinCodes ? (
            <ProposalPinCodes
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.UnpinCodes ? (
            <ProposalUnpinCodes
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.UpdateConsensusBlockParams ? (
            <ProposalUpdateConsensusBlockParams
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.UpdateConsensusEvidenceParams ? (
            <ProposalUpdateConsensusEvidenceParams
              proposalStep={proposalStep}
              setProposalStep={setProposalStep}
              isSubmitting={isSubmitting}
              setSubmitting={setSubmitting}
              setTxResult={setTxResult}
            />
          ) : proposalStep.type === ProposalType.MigrateContract ? (
            <ProposalMigrateContract
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
