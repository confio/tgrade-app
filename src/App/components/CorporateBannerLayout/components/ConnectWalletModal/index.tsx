import { Typography } from "antd";
import Stack from "App/components/Stack/style";
import WalletButton from "App/components/WalletButton";
import * as React from "react";
import { useEffect } from "react";
import { hitFaucetIfNeeded, isSdkInitialized, resetSdk, setSigner, useError, useSdk } from "service";
import { loadKeplrWallet, loadLedgerWallet, WalletLoader } from "utils/sdk";
import closeIcon from "./assets/cross.svg";
import keplrIcon from "./assets/keplr-logo.png";
import ledgerIcon from "./assets/ledger-logo.png";
import modalBg from "./assets/modal-background.jpg";
import StyledLeaveDsoModal, { ButtonGroup, LogoutButton, ModalHeader } from "./style";

const { Title, Text } = Typography;

/* function disableKeplrLogin() {
  return !(window.getOfflineSigner && window.keplr?.experimentalSuggestChain);
}

function disableLedgerLogin() {
  const anyNavigator: any = navigator;
  return !anyNavigator?.usb || !isChrome || !isDesktop;
} */

interface ConnectWalletModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
}

export default function ConnectWalletModal({
  isModalOpen,
  closeModal,
}: ConnectWalletModalProps): JSX.Element {
  const { handleError } = useError();
  const { sdkState, sdkDispatch } = useSdk();

  async function connectWallet(loadWallet: WalletLoader) {
    try {
      const signer = await loadWallet(sdkState.config);

      if ((signer as any).ledger) {
        await signer.getAccounts();
      }

      setSigner(sdkDispatch, signer);
      closeModal();
    } catch (error) {
      handleError(error);
    }
  }

  function logout() {
    resetSdk(sdkDispatch);
    closeModal();
  }

  useEffect(() => {
    (async function hitFaucetIfInit() {
      if (isSdkInitialized(sdkState)) {
        await hitFaucetIfNeeded(sdkState);
      }
    })();
  }, [sdkState]);

  return (
    <StyledLeaveDsoModal
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
      <Stack gap="s1">
        <ModalHeader>
          <Stack gap="s1">
            <Title>Connect Wallet</Title>
            <Text>To begin this journey, choose a wallet to connect:</Text>
          </Stack>
          <img alt="Close button" src={closeIcon} onClick={() => closeModal()} />
        </ModalHeader>
        <ButtonGroup>
          {!(sdkState.signer as any)?.keplr ? (
            <WalletButton
              iconSrc={keplrIcon}
              iconAlt="Keplr logo"
              text="Keplr wallet"
              onClick={() => connectWallet(loadKeplrWallet)}
            />
          ) : null}
          {!(sdkState.signer as any)?.ledger ? (
            <WalletButton
              iconSrc={ledgerIcon}
              iconAlt="Ledger logo"
              text="Ledger wallet"
              onClick={() => connectWallet(loadLedgerWallet)}
            />
          ) : null}
        </ButtonGroup>
        {sdkState.address ? (
          <LogoutButton onClick={() => logout()}>
            <div>Logout</div>
          </LogoutButton>
        ) : null}
      </Stack>
    </StyledLeaveDsoModal>
  );
}
