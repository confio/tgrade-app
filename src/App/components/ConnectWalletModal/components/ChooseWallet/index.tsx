import { Typography } from "antd";
import { resetSdk, useSdk } from "service";
import { isKeplrSigner, isLedgerSigner, isWebSigner, setLastConnectedWallet } from "utils/sdk";
import closeIcon from "../../../../assets/icons/cross.svg";
import webIcon from "../../../../assets/icons/web.svg";
import keplrIcon from "../../../../assets/images/keplr-logo.png";
import ledgerIcon from "../../../../assets/images/ledger-logo.png";
import Stack from "../../../Stack/style";
import WalletButton from "../../../WalletButton";
import { ChooseButtons, LogoutButton, ModalHeader, StyledAddressTag, SwitchButtons } from "./style";

const { Title, Text } = Typography;

interface ChooseWalletProps {
  readonly closeModal: () => void;
  readonly chooseKeplr: () => void;
  readonly chooseLedger: () => void;
  readonly chooseWeb: () => void;
}

export default function ChooseWallet({
  closeModal,
  chooseKeplr,
  chooseLedger,
  chooseWeb,
}: ChooseWalletProps): JSX.Element {
  const {
    sdkState: { signer, address },
    sdkDispatch,
  } = useSdk();

  function logout(): void {
    resetSdk(sdkDispatch);
    closeModal();
    setLastConnectedWallet("");
  }

  return (
    <Stack gap="s1">
      <ModalHeader>
        <Stack gap="s1">
          <Title>Connect Wallet</Title>
        </Stack>
        <img alt="Close button" src={closeIcon} onClick={() => closeModal()} />
      </ModalHeader>
      {address ? (
        <SwitchButtons>
          <Stack gap="s1">
            <Text>Currently connected to {isKeplrSigner(signer) ? "Keplr" : "Ledger"}:</Text>
            <StyledAddressTag address={address} copyable />
          </Stack>
          <Stack gap="s1">
            <Text>Switch to:</Text>
            {!isKeplrSigner(signer) ? (
              <WalletButton
                iconSrc={keplrIcon}
                iconAlt="Keplr logo"
                text="Keplr wallet"
                onClick={() => chooseKeplr()}
              />
            ) : null}
            {!isLedgerSigner(signer) ? (
              <WalletButton
                iconSrc={ledgerIcon}
                iconAlt="Ledger logo"
                text="Ledger wallet"
                onClick={() => chooseLedger()}
              />
            ) : null}
            {!isWebSigner(signer) ? (
              <WalletButton
                iconSrc={webIcon}
                iconAlt="Web logo"
                text="Web wallet (demo)"
                onClick={() => chooseWeb()}
              />
            ) : null}
          </Stack>
        </SwitchButtons>
      ) : (
        <Stack gap="s1">
          <Text>To begin this journey, choose a wallet to connect:</Text>
          <ChooseButtons>
            {!isKeplrSigner(signer) ? (
              <WalletButton
                iconSrc={keplrIcon}
                iconAlt="Keplr logo"
                text="Keplr wallet"
                onClick={() => chooseKeplr()}
              />
            ) : null}
            {!isLedgerSigner(signer) ? (
              <WalletButton
                iconSrc={ledgerIcon}
                iconAlt="Ledger logo"
                text="Ledger wallet"
                onClick={() => chooseLedger()}
              />
            ) : null}
            {!isWebSigner(signer) ? (
              <WalletButton
                iconSrc={webIcon}
                iconAlt="Web logo"
                text="Web wallet (demo)"
                onClick={() => chooseWeb()}
              />
            ) : null}
          </ChooseButtons>
        </Stack>
      )}
      {address ? (
        <LogoutButton type="ghost" onClick={() => logout()}>
          <div>Logout</div>
        </LogoutButton>
      ) : null}
    </Stack>
  );
}
