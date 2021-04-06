import { Button } from "antd";
import { Stack } from "App/components/layout";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MnemonicGrid, WarningText } from "./style";

interface MnemonicProps {
  readonly mnemonic: string;
}

export default function Mnemonic({ mnemonic }: MnemonicProps): JSX.Element {
  const { t } = useTranslation("account");

  const [showMnemonic, setShowMnemonic] = useState(false);
  const toggleShowMnemonic = () => setShowMnemonic((showMnemonic) => !showMnemonic);

  return (
    <>
      <Button type="primary" onClick={toggleShowMnemonic}>
        {showMnemonic ? t("hideWords") : t("showWords")}
      </Button>
      {showMnemonic ? (
        <Stack gap="s2">
          <MnemonicGrid>
            {mnemonic.split(" ").map((word) => (
              <div>{word}</div>
            ))}
          </MnemonicGrid>
          <WarningText>{t("wordsMsg")}</WarningText>
        </Stack>
      ) : null}
    </>
  );
}
