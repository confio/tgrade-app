import { makeCosmoshubPath, Secp256k1HdWallet } from "@cosmjs/launchpad";
import { Typography } from "antd";
import { Stack } from "App/components/layout";
import { Loading } from "App/components/logic";
import copyToClipboard from "clipboard-copy";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useError, useSdk } from "service";
import { useLayout } from "service/layout";
import { useLocalStorage } from "utils/cw20";
import { isWalletEncrypted } from "utils/sdk";
import copyIcon from "./assets/copyIcon.svg";
import LockAccount, { FormLockAccountFields } from "./components/LockAccount";
import Mnemonic from "./components/Mnemonic";
import UnlockAccount, { FormUnlockAccountFields } from "./components/UnlockAccount";
import { CopyAddressButton } from "./style";

const { Title, Text } = Typography;

export default function Account(): JSX.Element {
  const { t } = useTranslation("account");
  useLayout({});

  const [loadingMsg, setLoadingMsg] = useState<string>();
  const { handleError } = useError();
  const { getAddress } = useSdk();
  const address = getAddress();
  const [mnemonic, setMnemonic] = useLocalStorage<string>("burner-wallet", "");
  const isMnemonicEncrypted = isWalletEncrypted(mnemonic);

  const [password, setPassword] = useState<string>();
  const [decryptedMnemonic, setDecryptedMnemonic] = useState<string>();

  useEffect(() => {
    if (!isMnemonicEncrypted) setDecryptedMnemonic(mnemonic);
  }, [isMnemonicEncrypted, mnemonic]);

  useEffect(() => {
    (async function unlockAccount() {
      if (loadingMsg !== t("unlocking") || !password) return;

      try {
        const { mnemonic: decryptedMnemonic } = await Secp256k1HdWallet.deserialize(
          mnemonic,
          password.normalize(),
        );

        setDecryptedMnemonic(decryptedMnemonic);
        setLoadingMsg(undefined);
      } catch (error) {
        handleError(error);
        setLoadingMsg(undefined);
      }
    })();
  }, [handleError, loadingMsg, mnemonic, password, t]);

  function submitUnlockAccount({ password }: FormUnlockAccountFields) {
    setLoadingMsg(t("unlocking"));
    setPassword(password);
  }

  async function submitLockAccount({ password }: FormLockAccountFields) {
    setLoadingMsg(t("locking"));

    try {
      const encryptedMnemonic = await (
        await Secp256k1HdWallet.fromMnemonic(mnemonic, makeCosmoshubPath(0), "wasm")
      ).serialize(password.normalize());

      setMnemonic(encryptedMnemonic);
      setLoadingMsg(undefined);
    } catch (error) {
      handleError(error);
      setLoadingMsg(undefined);
    }
  }

  return (
    <Stack gap="s4">
      <Title>{t("account")}</Title>
      <CopyAddressButton type="default" onClick={() => copyToClipboard(address)}>
        <Text>{address}</Text>
        <img src={copyIcon} alt="Copy icon" />
      </CopyAddressButton>
      <Loading loading={loadingMsg}>
        {isMnemonicEncrypted && !decryptedMnemonic ? (
          <UnlockAccount submitUnlockAccount={submitUnlockAccount} />
        ) : null}
        {!isMnemonicEncrypted ? <LockAccount submitLockAccount={submitLockAccount} /> : null}
        {decryptedMnemonic ? <Mnemonic mnemonic={decryptedMnemonic} /> : null}
      </Loading>
    </Stack>
  );
}
