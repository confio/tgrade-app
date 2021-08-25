import modalBg from "App/assets/images/modal-background.jpg";
import Button from "App/components/Button";
import ShowTxResult, { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import IssueTokenForm from "../IssueTokenForm";
import { default as StyledIssueTokenModal } from "./style";

interface IssueTokenModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
}

export default function IssueTokenModal({ isModalOpen, closeModal }: IssueTokenModalProps): JSX.Element {
  const [txResult, setTxResult] = useState<TxResult>();

  function resetModal() {
    closeModal();
    setTxResult(undefined);
  }

  return (
    <StyledIssueTokenModal
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
        <ShowTxResult {...txResult}>
          {txResult.error ? (
            <Button onClick={() => setTxResult(undefined)}>
              <span>Try again</span>
            </Button>
          ) : null}
          <Button onClick={() => resetModal()}>
            <span>Go to T-Market</span>
          </Button>
        </ShowTxResult>
      ) : (
        <IssueTokenForm setTxResult={setTxResult} closeModal={closeModal} />
      )}
    </StyledIssueTokenModal>
  );
}
