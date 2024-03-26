import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { useCallback, useState } from "react";
import { useError, useSdk } from "service";
import { ApContract } from "utils/arbiterPool";
import { getErrorFromStackTrace } from "utils/errors";

import ComplaintData from "./components/ComplaintData";
import ConfirmComplaintAction from "./components/ConfirmComplaintAction";
import FormAcceptComplaint from "./components/FormAcceptComplaint";
import FormRenderDecision, { FormRenderDecisionValues } from "./components/FormRenderDecision";
import FormWithdrawComplaint, { FormWithdrawComplaintValues } from "./components/FormWithdrawComplaint";
import SelectComplaintAction from "./components/SelectComplaintAction";
import ShowTxResultProposal from "./components/ShowTxResultProposal";
import { ModalHeader, Separator, StyledModal } from "./style";

const { Title, Text } = Typography;
const { Step } = Steps;

export enum ComplaintAction {
  AcceptComplaint = "accept-complaint",
  WithdrawComplaint = "withdraw-complaint",
  RenderDecision = "render-decision",
}

export const complaintActionTitles = {
  [ComplaintAction.AcceptComplaint]: "Accept complaint",
  [ComplaintAction.WithdrawComplaint]: "Withdraw complaint",
  [ComplaintAction.RenderDecision]: "Render decision",
};

export type ComplaintActionStep = { type: ComplaintAction; confirmation?: true };

function getTitleFromStep(step?: ComplaintActionStep): string {
  if (!step) return "Unknown step";

  return step.confirmation
    ? `Confirm ${complaintActionTitles[step.type]}?`
    : complaintActionTitles[step.type];
}

interface ApComplaintDetailModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly complaintId: number | undefined;
  readonly refreshComplaints: () => void;
}

export default function ApComplaintDetailModal({
  isModalOpen,
  closeModal,
  complaintId,
  refreshComplaints,
}: ApComplaintDetailModalProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, signingClient, address },
  } = useSdk();

  const [complaintActionStep, setComplaintActionStep] = useState<ComplaintActionStep>({
    type: ComplaintAction.AcceptComplaint,
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  const [reason, setReason] = useState("");
  const [summary, setSummary] = useState("");
  const [ipfsLink, setIpfsLink] = useState("");

  function tryAgain() {
    setComplaintActionStep(
      complaintActionStep ? { type: complaintActionStep.type } : { type: ComplaintAction.AcceptComplaint },
    );
    setTxResult(undefined);
  }

  function resetModal() {
    closeModal();
    setComplaintActionStep({ type: ComplaintAction.AcceptComplaint });
    setSubmitting(false);
    setTxResult(undefined);
    refreshComplaints();
  }

  function submitAcceptComplaintForm() {
    setComplaintActionStep({ type: ComplaintAction.AcceptComplaint, confirmation: true });
  }

  function submitWithdrawComplaintForm({ reason }: FormWithdrawComplaintValues) {
    setReason(reason);
    setComplaintActionStep({ type: ComplaintAction.WithdrawComplaint, confirmation: true });
  }

  function submitRenderDecisionForm({ summary, ipfsLink }: FormRenderDecisionValues) {
    setSummary(summary);
    setIpfsLink(ipfsLink);
    setComplaintActionStep({ type: ComplaintAction.RenderDecision, confirmation: true });
  }

  const submitConfirmation = useCallback(async () => {
    if (!signingClient || !address || complaintId === undefined) return;
    setSubmitting(true);

    try {
      const apContract = new ApContract(config, signingClient);

      if (complaintActionStep.type === ComplaintAction.AcceptComplaint) {
        const txHash = await apContract.acceptComplaint(address, complaintId);
        setTxResult({
          msg: `Accepted complaint ${complaintId} in Arbiter Pool. Transaction ID: ${txHash}`,
        });
      }

      if (complaintActionStep.type === ComplaintAction.WithdrawComplaint) {
        const txHash = await apContract.withdrawComplaint(address, complaintId, reason);
        setTxResult({
          msg: `Withdrawn complaint ${complaintId} in Arbiter Pool. Transaction ID: ${txHash}`,
        });
      }

      if (complaintActionStep.type === ComplaintAction.RenderDecision) {
        const txHash = await apContract.renderDecision(address, complaintId, summary, ipfsLink);
        setTxResult({
          msg: `Rendered decision for complaint ${complaintId} in Arbiter Pool. Transaction ID: ${txHash}`,
        });
      }
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
      setTxResult({ error: getErrorFromStackTrace(error) });
    } finally {
      setSubmitting(false);
    }
  }, [
    address,
    complaintActionStep.type,
    complaintId,
    config,
    handleError,
    ipfsLink,
    reason,
    signingClient,
    summary,
  ]);

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
              <Title>{getTitleFromStep(complaintActionStep)}</Title>
              <Text>Arbiter Pool</Text>
            </Typography>
            <Steps size="small" current={complaintActionStep ? 1 : 0}>
              <Step />
              <Step />
            </Steps>
            {!isSubmitting ? <img alt="Close button" src={closeIcon} onClick={() => closeModal()} /> : null}
          </ModalHeader>
          <Separator />
          {!complaintActionStep.confirmation ? (
            <>
              <ComplaintData complaintId={complaintId} />
              <Separator />
              <SelectComplaintAction
                complaintActionStep={complaintActionStep}
                setComplaintActionStep={setComplaintActionStep}
              />
              {complaintActionStep.type === ComplaintAction.AcceptComplaint ? (
                <FormAcceptComplaint handleSubmit={submitAcceptComplaintForm} />
              ) : null}
              {complaintActionStep.type === ComplaintAction.WithdrawComplaint ? (
                <FormWithdrawComplaint reason={reason} handleSubmit={submitWithdrawComplaintForm} />
              ) : null}
              {complaintActionStep.type === ComplaintAction.RenderDecision ? (
                <FormRenderDecision
                  summary={summary}
                  ipfsLink={ipfsLink}
                  handleSubmit={submitRenderDecisionForm}
                />
              ) : null}
            </>
          ) : (
            <ConfirmComplaintAction
              complaintActionStep={complaintActionStep}
              reason={reason}
              summary={summary}
              ipfsLink={ipfsLink}
              isSubmitting={isSubmitting}
              goBack={() => {
                setComplaintActionStep((prevStep) => ({ type: prevStep.type }));
              }}
              submitForm={submitConfirmation}
            />
          )}
        </Stack>
      )}
    </StyledModal>
  );
}
