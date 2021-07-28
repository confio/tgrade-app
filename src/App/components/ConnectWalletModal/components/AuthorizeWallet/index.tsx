import { Spin, Typography } from "antd";
import Button from "../../../Button";
import Stack from "../../../Stack/style";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { setSigner, useError, useSdk } from "service";
import {
  isKeplrAvailable,
  isLedgerAvailable,
  isLedgerSigner,
  loadKeplrWallet,
  loadLedgerWallet,
  WalletLoader,
} from "utils/sdk";
import closeIcon from "../../../../assets/icons/cross.svg";
import errorIcon from "../../../../assets/icons/error.svg";
import loadingIcon from "../../../../assets/icons/loading.svg";
import { ButtonGroup, ErrorMsg, Indicator, ModalHeader } from "./style";

const { Title, Text } = Typography;

interface AuthorizeWalletProps {
  readonly closeModal: () => void;
  readonly goBack: () => void;
  readonly walletType: "keplr" | "ledger";
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
        const signer = await loadWallet(sdkState.config);

        if (isLedgerSigner(signer)) {
          await signer.getAccounts();
        }

        setSigner(sdkDispatch, signer);
        dismiss();
      } catch (error) {
        handleError(error);
        const toConnect = walletType === "keplr" ? "the Keplr extension" : "your Ledger";
        setError(`Please make sure ${toConnect} is connected`);
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
  }, [connectWallet, walletType]);

  return (
    <Stack gap="s1">
      <ModalHeader>
        <Title>Authorize your Wallet</Title>
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
