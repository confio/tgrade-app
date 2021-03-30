import { Button, Typography } from "antd";
import cosmWasmLogo from "App/assets/cosmWasmLogo.svg";
import { Stack } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { isChrome, isDesktop } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useError, useSdk } from "service";
import { useLayout } from "service/layout";
import {
  getWallet,
  isWalletEncrypted,
  loadKeplrWallet,
  loadLedgerWallet,
  loadOrCreateWallet,
  WalletLoader,
} from "utils/sdk";
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

export default function Menu(): JSX.Element {
  const { t } = useTranslation("login");
  const history = useHistory();
  const { setLoading } = useLayout({ hideMenu: true });

  const { handleError } = useError();
  const sdk = useSdk();
  const config = sdk.getConfig();

  async function init(loadWallet: WalletLoader) {
    setLoading(`${t("initializing")}`);

    try {
      const signer = await loadWallet(config);
      sdk.init(signer);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  }

  async function initBrowser() {
    const storedWallet = getWallet();
    if (!storedWallet || !isWalletEncrypted(storedWallet)) await init(loadOrCreateWallet);
    else history.push(`${paths.login.prefix}${paths.login.unlock}`);
  }

  async function initLedger() {
    await init(loadLedgerWallet);
  }

  async function initKeplr() {
    await init(loadKeplrWallet);
  }

  function goToImportAccount() {
    history.push(`${paths.login.prefix}${paths.login.import}`);
  }

  return (
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
          <Button data-size="large" type="primary" onClick={goToImportAccount}>
            {t("importButton")}
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
  );
}
