import { Typography } from "antd";
import { Button } from "App/components/form";
import { Stack } from "App/components/layoutPrimitives";
import { Spin } from "antd";
import * as React from "react";
import errorIcon from "./assets/error.svg";
import loadingIcon from "./assets/loading.svg";
import { useCallback, useEffect, useState } from "react";
import { hitFaucetIfNeeded, isSdkInitialized, setSigner, useError, useSdk } from "service";
import {
  isKeplrAvailable,
  isLedgerAvailable,
  isLedgerSigner,
  loadKeplrWallet,
  loadLedgerWallet,
  WalletLoader,
} from "utils/sdk";
import closeIcon from "../../assets/cross.svg";
import { ModalHeader, ErrorMsg, ButtonGroup, Indicator } from "./style";

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

  function dismiss() {
    closeModal();
    goBack();
  }

  const connectWallet = useCallback(
    async function (loadWallet: WalletLoader) {
      try {
        const signer = await loadWallet(sdkState.config);

        if (isLedgerSigner(signer)) {
          await signer.getAccounts();
        }

        setSigner(sdkDispatch, signer);
        goBack();
      } catch (error) {
        handleError(error);
        const toConnect = walletType === "keplr" ? "the Keplr extension" : "your Ledger";
        setError(`Please make sure ${toConnect} is connected`);
      }
    },
    [goBack, handleError, sdkDispatch, sdkState.config, walletType],
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

  useEffect(() => {
    (async function hitFaucetIfInit() {
      if (isSdkInitialized(sdkState)) {
        await hitFaucetIfNeeded(sdkState);
      }
    })();
  }, [sdkState]);

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
