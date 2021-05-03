import { Button, Typography } from "antd";
import { OldPageLayout, Stack } from "App/components/layout";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { setInitialLayoutState, useLayout, useSdk } from "service";
import FormSearchAddress from "./components/FormSearchAddress";
import TokenList from "./components/TokenList";

const { Title } = Typography;

export default function Tokens(): JSX.Element {
  const { t } = useTranslation("wallet");

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch), [layoutDispatch]);

  const {
    sdkState: { address },
  } = useSdk();

  const [currentAddress, setCurrentAddress] = useState(address);

  return (
    <OldPageLayout>
      <Stack gap="s4">
        <Title>{t("tokens")}</Title>
        <FormSearchAddress currentAddress={currentAddress} setCurrentAddress={setCurrentAddress} />
        <TokenList currentAddress={currentAddress} />
        {currentAddress !== address ? (
          <Button type="default" onClick={() => setCurrentAddress(address)}>
            {t("backToAccount")}
          </Button>
        ) : null}
      </Stack>
    </OldPageLayout>
  );
}
