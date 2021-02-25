import { Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import FormInputContract from "./routes/FormInputContract";
import FormSelectContracts from "./routes/FormSelectContracts";
import { MainStack } from "./style";

const { Title } = Typography;

interface ExistingParams {
  readonly codeId?: string;
}

export default function Existing(): JSX.Element {
  const { codeId } = useParams<ExistingParams>();
  const basePath = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAddExisting}`;
  const pathTokensAdd = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAdd}`;
  const pathBack = codeId ? basePath : pathTokensAdd;

  return (
    <PageLayout backButtonProps={{ path: pathBack }}>
      <MainStack>
        <Title>Add Existing Token</Title>
        <Switch>
          <Route exact path={basePath}>
            <FormInputContract />
          </Route>
          <Route path={`${basePath}${paths.cw20Wallet.params.codeId}`}>
            <FormSelectContracts />
          </Route>
        </Switch>
      </MainStack>
    </PageLayout>
  );
}
