import closeIcon from "App/assets/icons/cross.svg";
import Button from "App/components/Button";
import ShowTxResult, { TxResult } from "App/components/ShowTxResult";
import { lazy, useState } from "react";

import StakeForm from "./components/StakeForm";
import UnstakeForm from "./components/UnstakeForm";
import { ModalHeader, StakeMenu, StyledModal } from "./style";

const ConnectWalletModal = lazy(() => import("../ConnectWalletModal"));

export type StakeModalState =
  | {
      readonly open: true;
      readonly operation: "stake" | "unstake";
    }
  | {
      readonly open: false;
      readonly operation?: undefined;
    };

interface StakeModalProps {
  readonly modalState: StakeModalState;
  readonly setModalState: (state: StakeModalState) => void;
  readonly reloadValidator: () => Promise<void>;
}

export default function StakeModal({
  modalState,
  setModalState,
  reloadValidator,
}: StakeModalProps): JSX.Element {
  const [isConnectWalletModalOpen, setConnectWalletModalOpen] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  function resetModal() {
    setModalState({ open: false });
    setTxResult(undefined);
  }

  return (
    <StyledModal
      centered
      footer={null}
      closable={false}
      visible={modalState.open}
      destroyOnClose
      width="100%"
      bgTransparent={!!txResult}
      style={{
        right: "-40px",
        maxWidth: "40rem",
        paddingRight: "60px",
      }}
      bodyStyle={{
        position: "relative",
        padding: "0",
        paddingTop: "4px",
        paddingBottom: "20px",
        borderRadius: "16px",
        backgroundColor: txResult ? "transparent" : "var(--bg-body)",
      }}
      maskStyle={{ background: txResult ? "rgba(4,119,120,0.9)" : "rgba(4,119,120,0.6)" }}
    >
      {txResult ? (
        <ShowTxResult {...txResult}>
          {txResult.error ? (
            <Button onClick={() => setTxResult(undefined)}>
              <span>Try again</span>
            </Button>
          ) : null}
          <Button onClick={() => resetModal()}>
            <span>Go to Validator details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <>
          <ModalHeader>
            <img alt="Close button" src={closeIcon} onClick={() => resetModal()} />
          </ModalHeader>
          <StakeMenu
            onClick={({ key }) => setModalState({ open: true, operation: key as "stake" | "unstake" })}
            selectedKeys={[modalState.operation ?? "stake"]}
            mode="horizontal"
          >
            <StakeMenu.Item key="stake">Stake tokens</StakeMenu.Item>
            <StakeMenu.Item key="unstake">Unstake tokens</StakeMenu.Item>
          </StakeMenu>
          {modalState.operation === "stake" ? (
            <StakeForm setTxResult={setTxResult} reloadValidator={reloadValidator} />
          ) : (
            <UnstakeForm setTxResult={setTxResult} reloadValidator={reloadValidator} />
          )}
        </>
      )}
      <ConnectWalletModal
        isModalOpen={isConnectWalletModalOpen}
        closeModal={() => setConnectWalletModalOpen(false)}
      />
    </StyledModal>
  );
}
