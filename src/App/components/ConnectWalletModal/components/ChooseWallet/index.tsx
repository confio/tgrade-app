import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import keplrIcon from "App/assets/icons/keplr-logo.svg";
import ledgerIcon from "App/assets/icons/ledger-logo.svg";
import tgradeIcon from "App/assets/icons/tgrade-icon-dark.svg";
import { resetSdk, useSdk } from "service";
import {
  getLastConnectedWallet,
  isKeplrSigner,
  isLedgerSigner,
  isWebSigner,
  setLastConnectedWallet,
} from "utils/sdk";

import Stack from "../../../Stack/style";
import WalletButton from "../../../WalletButton";
import { BalancesList } from "./components/BalancesList";
import {
  ChooseButtons,
  LogoutButton,
  ModalHeader,
  StyledAddressTag,
  SwitchButtons,
  WalletConnected,
} from "./style";

const { Text } = Typography;

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
    sdkState: { config, signer, address },
    sdkDispatch,
  } = useSdk();

  function getWalletLogo() {
    if (isKeplrSigner(signer)) return keplrIcon;
    if (isLedgerSigner(signer)) return ledgerIcon;
    if (isWebSigner(signer)) return tgradeIcon;

    return undefined;
  }

  function logout(): void {
    resetSdk(sdkDispatch);
    closeModal();
    setLastConnectedWallet("");
  }

  const lastConnectedWallet = getLastConnectedWallet();
  const capitalizedWallet = lastConnectedWallet
    ? lastConnectedWallet.charAt(0).toUpperCase() + lastConnectedWallet.slice(1)
    : undefined;
  const walletLogo = getWalletLogo();

  return (
    <>
      <ModalHeader>
        <img
          alt="Close button"
          data-cy="connect-wallet-modal-close-icon"
          src={closeIcon}
          onClick={() => closeModal()}
        />
      </ModalHeader>
      {address ? (
        <SwitchButtons>
          <Stack gap="s1">
            {capitalizedWallet && walletLogo ? (
              <>
                <WalletConnected>
                  <img alt="" src={walletLogo} />
                  <Text>{capitalizedWallet} wallet is connected with address:</Text>
                </WalletConnected>
                <StyledAddressTag address={address} copyable />
              </>
            ) : (
              <Text>Loading wallet...</Text>
            )}
            <BalancesList closeModal={closeModal} />
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
            {!isWebSigner(signer) && config.faucetUrl ? (
              <WalletButton
                iconSrc={tgradeIcon}
                iconAlt="Web logo"
                text="Web wallet (demo)"
                onClick={() => chooseWeb()}
              />
            ) : null}
            <LogoutButton type="ghost" onClick={() => logout()}>
              <div>Logout</div>
            </LogoutButton>
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
            {!isWebSigner(signer) && config.faucetUrl ? (
              <WalletButton
                iconSrc={tgradeIcon}
                iconAlt="Web wallet logo"
                text="Web wallet (demo)"
                onClick={() => chooseWeb()}
              />
            ) : null}
          </ChooseButtons>
        </Stack>
      )}
    </>
  );
}
