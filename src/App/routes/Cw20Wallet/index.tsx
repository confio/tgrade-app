import { paths } from "App/paths";
import * as React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Token from "./routes/Token";
import TokenNew from "./routes/TokenNew";
import TokensAdd from "./routes/TokensAdd";
import TokensList from "./routes/TokensList";

export default function Cw20Wallet(): JSX.Element {
  const { path: basePath } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={basePath}>
        <Redirect to={{ pathname: `${basePath}${paths.cw20Wallet.tokens}` }} />
      </Route>
      <Route exact path={`${basePath}${paths.cw20Wallet.tokens}`}>
        <TokensList />
      </Route>
      <Route exact path={`${basePath}${paths.cw20Wallet.tokensAdd}`}>
        <TokensAdd />
      </Route>
      <Route exact path={`${basePath}${paths.cw20Wallet.tokensNew}`}>
        <TokenNew />
      </Route>
      <Route path={`${basePath}${paths.cw20Wallet.tokens}`}>
        <Token />
      </Route>
    </Switch>
  );
}
