import { Spin, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { setSigner, useError, useSdk } from "service";
import {
  isKeplrAvailable,
  isKeplrSigner,
  isLedgerAvailable,
  isLedgerSigner,
  isWebSigner,
  loadKeplrWallet,
  loadLedgerWallet,
  loadOrCreateWallet,
  setLastConnectedWallet,
  WalletLoader,
} from "utils/sdk";

import closeIcon from "../../../../assets/icons/cross.svg";
import loadingIcon from "../../../../assets/icons/loading.svg";
import errorIcon from "../../../../assets/icons/warning.svg";
import Button from "../../../Button";
import Stack from "../../../Stack/style";
import { ButtonGroup, ErrorMsg, Indicator, ModalHeader } from "./style";

const { Title, Text } = Typography;

interface AuthorizeWalletProps {
  readonly closeModal: () => void;
  readonly goBack: () => void;
  readonly walletType: "keplr" | "ledger" | "web";
}

export default function AuthorizeWallet({
  closeModal,
  goBack,
  walletType,
}: AuthorizeWalletProps): JSX.Element {
  const { handleError } = useError();
  const { sdkState, sdkDispatch } = useSdk();
  const [error, setError] = useState<string>();

  const dismiss = useCallback(
    function (): void {
      closeModal();
      goBack();
    },
    [closeModal, goBack],
  );

  const connectWallet = useCallback(
    async function (loadWallet: WalletLoader) {
      try {
        // Get a keplr, ledger, or web signer
        const signer = await loadWallet(sdkState.config);

        if (isLedgerSigner(signer)) {
          // This makes ledger specifically throw if not ready
          await signer.getAccounts();
        }

        // Set the signer if it did not throw
        setSigner(sdkDispatch, signer);

        // Detect the type of signer and store it to know which one should reconnect
        if (isKeplrSigner(signer)) {
          setLastConnectedWallet("keplr");
        }
        if (isLedgerSigner(signer)) {
          setLastConnectedWallet("ledger");
        }
        if (isWebSigner(signer)) {
          setLastConnectedWallet("web");
        }

        dismiss();
      } catch (error) {
        setLastConnectedWallet("");
        if (walletType === "web") return;

        const toConnect = walletType === "keplr" ? "the Keplr extension" : "your Ledger";
        setError(`Please make sure ${toConnect} is connected`);

        if (!(error instanceof Error)) return;
        handleError(error);
      }
    },
    [dismiss, handleError, sdkDispatch, sdkState.config, walletType],
  );

  useEffect(() => {
    setError(undefined);

    if (walletType === "keplr") {
      if (isKeplrAvailable()) {
        connectWallet(loadKeplrWallet);
      } else {
        setError("The Keplr extension is not available");
      }
    }
    if (walletType === "ledger") {
      if (isLedgerAvailable()) {
        connectWallet(loadLedgerWallet);
      } else {
        setError("Your ledger is not available");
      }
    }
    if (walletType === "web") connectWallet(loadOrCreateWallet);
  }, [connectWallet, walletType]);

  return (
    <Stack gap="s1">
      <ModalHeader>
        <Title>{walletType === "web" ? "Loading your Wallet" : "Authorize your Wallet"}</Title>
        <img alt="Close button" src={closeIcon} onClick={() => closeModal()} />
      </ModalHeader>
      {error ? (
        <ErrorMsg>
          <img alt="Error icon" src={errorIcon} />
          <Text>{error}</Text>
        </ErrorMsg>
      ) : (
        <>
          <Text>Tgrade is trying to connect to your wallet</Text>
          <Spin spinning={true} indicator={<Indicator alt="Error icon" src={loadingIcon} />} />
        </>
      )}
      <ButtonGroup>
        <Button type="ghost" onClick={() => dismiss()}>
          <div>Dismiss</div>
        </Button>
        <Button onClick={() => goBack()}>
          <div>Try again</div>
        </Button>
      </ButtonGroup>
    </Stack>
  );
}
