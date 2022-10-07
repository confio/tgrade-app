import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { useCallback, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { ApContract, ApContractQuerier, Complaint } from "utils/arbiterPool";
import { getErrorFromStackTrace } from "utils/errors";

import ComplaintData from "./components/ComplaintData";
import ConfirmComplaintAction from "./components/ConfirmComplaintAction";
import FormAcceptComplaint from "./components/FormAcceptComplaint";
import FormWithdrawComplaint, { FormWithdrawComplaintValues } from "./components/FormWithdrawComplaint";
import SelectComplaintAction from "./components/SelectComplaintAction";
import ShowTxResultProposal from "./components/ShowTxResultProposal";
import { ModalHeader, Separator, StyledModal } from "./style";

const { Title, Text } = Typography;
const { Step } = Steps;

export enum ComplaintAction {
  AcceptComplaint = "accept-complaint",
  WithdrawComplaint = "withdraw-complaint",
}

export const complaintActionTitles = {
  [ComplaintAction.AcceptComplaint]: "Accept complaint",
  [ComplaintAction.WithdrawComplaint]: "Withdraw complaint",
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
    sdkState: { config, client, signingClient, address },
  } = useSdk();

  const [complaint, setComplaint] = useState<Complaint>();
  const [complaintActionStep, setComplaintActionStep] = useState<ComplaintActionStep>({
    type: ComplaintAction.AcceptComplaint,
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();
  const [reason, setReason] = useState("");

  useEffect(() => {
    (async function () {
      if (!client || complaintId === undefined) return;

      const apContract = new ApContractQuerier(config, client);
      const complaint = await apContract.getComplaint(complaintId);
      console.log({ complaint });
      setComplaint(complaint);
    })();
  }, [client, complaintId, config]);

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
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
      setTxResult({ error: getErrorFromStackTrace(error) });
    } finally {
      setSubmitting(false);
    }
  }, [address, complaintActionStep.type, complaintId, config, handleError, reason, signingClient]);

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
                <FormAcceptComplaint complaint={complaint} handleSubmit={submitAcceptComplaintForm} />
              ) : null}
              {complaintActionStep.type === ComplaintAction.WithdrawComplaint ? (
                <FormWithdrawComplaint
                  complaint={complaint}
                  reason={reason}
                  handleSubmit={submitWithdrawComplaintForm}
                />
              ) : null}
            </>
          ) : (
            <ConfirmComplaintAction
              complaintActionStep={complaintActionStep}
              reason={reason}
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
