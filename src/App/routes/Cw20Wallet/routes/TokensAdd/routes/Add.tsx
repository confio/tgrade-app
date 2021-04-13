import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { setInitialLayoutState, useLayout } from "service/layout";

const { Title } = Typography;

const pathTokens = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}`;

export default function Add(): JSX.Element {
  const { t } = useTranslation("cw20Wallet");
  const history = useHistory();

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathTokens } }), [
    layoutDispatch,
  ]);

  return (
    <Stack gap="s4">
      <Title>{t("addAnother")}</Title>
      <Button
        type="primary"
        onClick={() => history.push(`${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAddExisting}`)}
      >
        {t("existing")}
      </Button>
      <Button
        type="primary"
        onClick={() => history.push(`${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAddNew}`)}
      >
        {t("new")}
      </Button>
    </Stack>
  );
}
