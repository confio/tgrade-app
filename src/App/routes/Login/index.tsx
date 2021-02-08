import { Button, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { Loading } from "App/components/logic";
import { RedirectLocation } from "App/components/logic/ProtectedSwitch";
import { pathWallet } from "App/paths";
import { configKeplr } from "config/keplr";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useError, useSdk } from "service";
import { loadKeplrWallet, loadLedgerWallet, loadOrCreateWallet, WalletLoader } from "utils/sdk";
import cosmWasmLogo from "./assets/cosmWasmLogo.svg";
import { LightText, Logo, StackButtons, StackLogoText, StackText, StackTextButtons } from "./style";

const { Title } = Typography;

function disableLedgerLogin() {
  const anyNavigator: any = navigator;
  return !anyNavigator?.usb;
}

function disableKeplrLogin() {
  // TODO find check that works on reload
  //const anyWindow: any = window;
  //return !(anyWindow.getOfflineSigner && anyWindow.keplr.experimentalSuggestChain);
  return false;
}

export default function Login(): JSX.Element {
  const history = useHistory();
  const state = history.location.state as RedirectLocation;
  const { handleError } = useError();
  const sdk = useSdk();
  const config = sdk.getConfig();

  const [initializing, setInitializing] = useState(false);

  async function init(loadWallet: WalletLoader) {
    setInitializing(true);

    try {
      const signer = await loadWallet(config.chainId, config.addressPrefix);
      sdk.init(signer);
    } catch (error) {
      setInitializing(false);
      handleError(error);
    }
  }

  async function initBrowser() {
    await init(loadOrCreateWallet);
  }

  async function initLedger() {
    await init(loadLedgerWallet);
  }

  async function initKeplr() {
    const anyWindow: any = window;
    try {
      await anyWindow.keplr.experimentalSuggestChain(configKeplr(config));
      await anyWindow.keplr.enable(config.chainId);
      await init(loadKeplrWallet);
    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    if (!sdk.initialized) return;

    if (state) {
      history.push(state.redirectPathname, state.redirectState);
    } else {
      history.push(pathWallet);
    }
  }, [history, sdk.initialized, state]);

  return initializing ? (
    <Loading loadingText="Initializing app..." />
  ) : (
    <PageLayout hide="header">
      <StackLogoText>
        <Logo src={cosmWasmLogo} alt="CosmWasm logo" />
        <StackTextButtons>
          <StackText>
            <Title level={1}>Hello!</Title>
            <LightText>Welcome to your Wallet</LightText>
            <LightText>Select one of the following options to start</LightText>
          </StackText>
          <StackButtons>
            <Button data-size="large" type="primary" onClick={initBrowser}>
              Browser (Demo)
            </Button>
            <Button data-size="large" type="primary" disabled={disableLedgerLogin()} onClick={initLedger}>
              Ledger (Secure, Chrome)
            </Button>
            <Button data-size="large" type="primary" disabled={disableKeplrLogin()} onClick={initKeplr}>
              Keplr (Secure)
            </Button>
          </StackButtons>
        </StackTextButtons>
      </StackLogoText>
    </PageLayout>
  );
}
