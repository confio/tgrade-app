import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSdk } from "service";
import { setInitialLayoutState, useLayout } from "service/layout";
import FormSearchAddress from "./components/FormSearchAddress";
import TokenList from "./components/TokenList";

const { Title } = Typography;

export default function Tokens(): JSX.Element {
  const { t } = useTranslation("wallet");
  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch), [layoutDispatch]);

  const { getAddress } = useSdk();
  const address = getAddress();

  const [currentAddress, setCurrentAddress] = useState(address);

  return (
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
  );
}
