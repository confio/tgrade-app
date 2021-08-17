import * as React from "react";
import { useEffect, useState } from "react";
import { hitFaucetIfNeeded, isSdkInitialized, useSdk } from "service";
import modalBg from "../../assets/images/modal-background.jpg";
import AuthorizeWallet from "./components/AuthorizeWallet";
import ChooseWallet from "./components/ChooseWallet";
import StyledConnectWalletModal from "./style";

enum ConnectWalletSteps {
  Choose = "Choose",
  AuthorizeKeplr = "AuthorizeKeplr",
  AuthorizeLedger = "AuthorizeLedger",
}

interface ConnectWalletModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
}

export default function ConnectWalletModal({
  isModalOpen,
  closeModal,
}: ConnectWalletModalProps): JSX.Element {
  const { sdkState } = useSdk();
  const [connectWalletStep, setConnectWalletStep] = useState(ConnectWalletSteps.Choose);

  useEffect(() => {
    (async function hitFaucetIfInit() {
      if (isSdkInitialized(sdkState)) {
        await hitFaucetIfNeeded(sdkState);
      }
    })();
  }, [sdkState]);

  return (
    <StyledConnectWalletModal
      centered
      footer={null}
      closable={false}
      visible={isModalOpen}
      width="100%"
      style={{
        maxWidth: "63.25rem",
        paddingRight: "60px",
      }}
      bodyStyle={{
        position: "relative",
        padding: "var(--s1)",
        backgroundColor: "var(--bg-body)",
      }}
      maskStyle={{
        background: `linear-gradient(0deg, rgba(4, 119, 120, 0.9), rgba(4, 119, 120, 0.9)), url(${modalBg})`,
        backgroundSize: "cover",
      }}
    >
      {connectWalletStep === ConnectWalletSteps.Choose ? (
        <ChooseWallet
          closeModal={closeModal}
          chooseKeplr={() => setConnectWalletStep(ConnectWalletSteps.AuthorizeKeplr)}
          chooseLedger={() => setConnectWalletStep(ConnectWalletSteps.AuthorizeLedger)}
        />
      ) : (
        <AuthorizeWallet
          closeModal={closeModal}
          goBack={() => setConnectWalletStep(ConnectWalletSteps.Choose)}
          walletType={connectWalletStep === ConnectWalletSteps.AuthorizeKeplr ? "keplr" : "ledger"}
        />
      )}
    </StyledConnectWalletModal>
  );
}
