import { useEffect, useState } from "react";
import { hitFaucetIfNeeded, isSdkInitialized, useSdk } from "service";
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
      maskStyle={{ background: "rgba(4,119,120,0.6)" }}
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
