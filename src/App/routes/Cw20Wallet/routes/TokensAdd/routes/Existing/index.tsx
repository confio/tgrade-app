import { Typography } from "antd";
import { OldPageLayout, Stack } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useParams } from "react-router-dom";
import { setInitialLayoutState, useLayout } from "service";
import FormInputContract from "./routes/FormInputContract";
import FormSelectContracts from "./routes/FormSelectContracts";

const { Title } = Typography;

const basePath = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAddExisting}`;
const pathTokensAdd = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAdd}`;

interface ExistingParams {
  readonly codeId?: string;
}

export default function Existing(): JSX.Element {
  const { t } = useTranslation("cw20Wallet");

  const { codeId } = useParams<ExistingParams>();
  const pathBack = codeId ? basePath : pathTokensAdd;

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathBack } }), [
    layoutDispatch,
    pathBack,
  ]);

  return (
    <OldPageLayout>
      <Stack gap="s4">
        <Title>{t("addExisting")}</Title>
        <Switch>
          <Route exact path={basePath}>
            <FormInputContract />
          </Route>
          <Route path={`${basePath}${paths.cw20Wallet.params.codeId}`}>
            <FormSelectContracts />
          </Route>
        </Switch>
      </Stack>
    </OldPageLayout>
  );
}
