import { Typography } from "antd";
import { Stack } from "App/components/layoutPrimitives";
import { WalletButton } from "App/components/logic";
import * as React from "react";
import { resetSdk, useSdk } from "service";
import { isKeplrSigner, isLedgerSigner } from "utils/sdk";
import closeIcon from "../../assets/cross.svg";
import keplrIcon from "./assets/keplr-logo.png";
import ledgerIcon from "./assets/ledger-logo.png";
import { ChooseButtons, LogoutButton, ModalHeader, StyledAddressTag, SwitchButtons } from "./style";

const { Title, Text } = Typography;

interface ChooseWalletProps {
  readonly closeModal: () => void;
  readonly chooseKeplr: () => void;
  readonly chooseLedger: () => void;
}

export default function ChooseWallet({
  closeModal,
  chooseKeplr,
  chooseLedger,
}: ChooseWalletProps): JSX.Element {
  const {
    sdkState: { signer, address },
    sdkDispatch,
  } = useSdk();

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
          </ChooseButtons>
        </Stack>
      )}
      {address ? (
        <LogoutButton type="ghost" onClick={() => resetSdk(sdkDispatch)}>
          <div>Logout</div>
        </LogoutButton>
      ) : null}
    </Stack>
  );
}
