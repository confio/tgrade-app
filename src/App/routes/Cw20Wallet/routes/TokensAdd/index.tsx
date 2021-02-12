import { Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import FormInputContract from "./routes/FormInputContract";
import FormSelectContracts from "./routes/FormSelectContracts";
import { MainStack } from "./style";

const { Title } = Typography;

interface TokensAddParams {
  readonly codeId?: string;
}

export default function TokensAdd(): JSX.Element {
  const { codeId } = useParams<TokensAddParams>();
  const pathTokensAdd = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAdd}`;
  const pathTokens = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}`;
  const pathBack = codeId ? pathTokensAdd : pathTokens;

  return (
    <PageLayout backButtonProps={{ path: pathBack }}>
      <MainStack>
        <Title>Add Other</Title>
        <Switch>
          <Route exact path={pathTokensAdd}>
            <FormInputContract />
          </Route>
          <Route path={`${pathTokensAdd}${paths.cw20Wallet.params.codeId}`}>
            <FormSelectContracts />
          </Route>
        </Switch>
      </MainStack>
    </PageLayout>
  );
}
