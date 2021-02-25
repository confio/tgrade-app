import { paths } from "App/paths";
import * as React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Token from "./routes/Token";
import TokensAdd from "./routes/TokensAdd";
import TokensList from "./routes/TokensList";

const {
  cw20Wallet: cw20WalletPaths,
  cw20Wallet: { params: cw20WalletParams },
} = paths;

export default function Cw20Wallet(): JSX.Element {
  const { path: basePath } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={basePath}>
        <Redirect to={{ pathname: `${basePath}${cw20WalletPaths.tokens}` }} />
      </Route>
      <Route exact path={`${basePath}${cw20WalletPaths.tokens}`}>
        <TokensList />
      </Route>
      <Route path={`${basePath}${cw20WalletPaths.tokensAdd}`}>
        <TokensAdd />
      </Route>
      <Route path={`${basePath}${cw20WalletPaths.tokens}${cw20WalletParams.contractAddress}`}>
        <Token />
      </Route>
    </Switch>
  );
}
