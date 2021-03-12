import { Button, Typography } from "antd";
import { PageLayout, Stack } from "App/components/layout";
import { Loading } from "App/components/logic";
import { RedirectLocation } from "App/components/logic/ProtectedSwitch";
import { paths } from "App/paths";
import { configKeplr } from "config/keplr";
import * as React from "react";
import { useEffect, useState } from "react";
import { isChrome, isDesktop } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useError, useSdk } from "service";
import { loadKeplrWallet, loadLedgerWallet, loadOrCreateWallet, WalletLoader } from "utils/sdk";
import cosmWasmLogo from "./assets/cosmWasmLogo.svg";
import { LightText, Logo } from "./style";

const { Title } = Typography;

function disableLedgerLogin() {
  const anyNavigator: any = navigator;
  return !anyNavigator?.usb || !isChrome || !isDesktop;
}

function disableKeplrLogin() {
  const anyWindow: any = window;
  return !(anyWindow.getOfflineSigner && anyWindow.keplr.experimentalSuggestChain);
}

export default function Login(): JSX.Element {
  const { t } = useTranslation("login");
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
      history.push(paths.wallet.prefix);
    }
  }, [history, sdk.initialized, state]);

  return initializing ? (
    <Loading loadingText="Initializing app..." />
  ) : (
    <PageLayout hide="header">
      <Stack gap="s5">
        <Logo src={cosmWasmLogo} alt="CosmWasm logo" />
        <Stack gap="s3">
          <Stack gap="s-1">
            <Title level={1}>{t("hello")}</Title>
            <LightText>{t("welcome")}</LightText>
            <LightText>{t("select")}</LightText>
          </Stack>
          <Stack>
            <Button data-size="large" type="primary" onClick={initBrowser}>
              {t("browserButton")}
            </Button>
            <Button data-size="large" type="primary" disabled={disableLedgerLogin()} onClick={initLedger}>
              {t("ledgerButton")}
            </Button>
            <Button data-size="large" type="primary" disabled={disableKeplrLogin()} onClick={initKeplr}>
              {t("keplrButton")}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </PageLayout>
  );
}
