import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { useState } from "react";

import { useError, useSdk } from "../../../service";
import { ApContract } from "../../../utils/arbiterPool";
import { getErrorFromStackTrace } from "../../../utils/errors";
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

export interface CreateFormComplaintValues {
  readonly dsoName: string;
  readonly votingDuration: string;
  readonly quorum: string;
  readonly threshold: string;
  readonly allowEndEarly: boolean;
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
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [defendant, setDefendant] = useState("");

  function tryAgain() {
    setTxResult(undefined);
  }

  function resetModal() {
    closeModal();
    setSubmitting(false);
    setTxResult(undefined);
    refreshComplaints();
  }

  async function confirmAndSubmitComplaintForm({
    title,
    description,
    defendant,
  }: FormRegisterComplaintValues) {
    setTitle(title);
    setDescription(description);
    setDefendant(defendant);

    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const apContract = new ApContract(config, signingClient);
      const { txHash } = await apContract.registerComplaint(address, title, description, defendant);

      setTxResult({
        msg: `Created proposal for Complaint Arbiter Pool. Transaction ID: ${txHash}`,
      });
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

  async function createAndConfirmProposal({ title, description, defendant }: FormRegisterComplaintValues) {
    // TODO as next step
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
            title={title}
            description={description}
            defendant={defendant}
            goBack={() => setProposalStep(undefined)}
            handleSubmit={confirmAndSubmitComplaintForm}
          />
        </Stack>
      )}
    </StyledModal>
  );
}
