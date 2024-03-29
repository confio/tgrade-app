import { useState } from "react";

import AuthorizeWallet from "./components/AuthorizeWallet";
import ChooseWallet from "./components/ChooseWallet";
import StyledConnectWalletModal from "./style";

enum ConnectWalletSteps {
  Choose = "choose",
  AuthorizeKeplr = "keplr",
  AuthorizeLedger = "ledger",
  LoadWeb = "web",
}

interface ConnectWalletModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
}

export default function ConnectWalletModal({
  isModalOpen,
  closeModal,
}: ConnectWalletModalProps): JSX.Element {
  const [connectWalletStep, setConnectWalletStep] = useState(ConnectWalletSteps.Choose);

  return (
    <StyledConnectWalletModal
      destroyOnClose
      centered
      footer={null}
      closable={false}
      visible={isModalOpen}
      width="100%"
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
      {connectWalletStep === ConnectWalletSteps.Choose ? (
        <ChooseWallet
          closeModal={closeModal}
          chooseKeplr={() => setConnectWalletStep(ConnectWalletSteps.AuthorizeKeplr)}
          chooseLedger={() => setConnectWalletStep(ConnectWalletSteps.AuthorizeLedger)}
          chooseWeb={() => setConnectWalletStep(ConnectWalletSteps.LoadWeb)}
        />
      ) : (
        <AuthorizeWallet
          closeModal={closeModal}
          goBack={() => setConnectWalletStep(ConnectWalletSteps.Choose)}
          walletType={connectWalletStep}
        />
      )}
    </StyledConnectWalletModal>
  );
}
