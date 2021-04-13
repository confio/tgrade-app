import { makeCosmoshubPath, Secp256k1HdWallet } from "@cosmjs/launchpad";
import { Typography } from "antd";
import { Stack } from "App/components/layout";
import { Loading } from "App/components/logic";
import copyToClipboard from "clipboard-copy";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { setInitialLayoutState, useError, useLayout, useSdk } from "service";
import { useLocalStorage } from "utils/cw20";
import { isWalletEncrypted } from "utils/sdk";
import { runAfterLoad } from "utils/ui";
import copyIcon from "./assets/copyIcon.svg";
import LockAccount, { FormLockAccountFields } from "./components/LockAccount";
import Mnemonic from "./components/Mnemonic";
import UnlockAccount, { FormUnlockAccountFields } from "./components/UnlockAccount";
import { CopyAddressButton } from "./style";

const { Title, Text } = Typography;

export default function Account(): JSX.Element {
  const { t } = useTranslation("account");
  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch), [layoutDispatch]);

  const [loadingMsg, setLoadingMsg] = useState<string>();
  const { handleError } = useError();
  const {
    sdkState: { address },
  } = useSdk();
  const [mnemonic, setMnemonic] = useLocalStorage<string>("burner-wallet", "");
  const isMnemonicEncrypted = isWalletEncrypted(mnemonic);
  const [decryptedMnemonic, setDecryptedMnemonic] = useState<string>();

  useEffect(() => {
    if (!isMnemonicEncrypted) setDecryptedMnemonic(mnemonic);
  }, [isMnemonicEncrypted, mnemonic]);

  async function submitUnlockAccount({ password }: FormUnlockAccountFields) {
    setLoadingMsg(t("unlocking"));

    runAfterLoad(async () => {
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
    });
  }

  async function submitLockAccount({ password }: FormLockAccountFields) {
    setLoadingMsg(t("locking"));

    runAfterLoad(async () => {
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
    });
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
