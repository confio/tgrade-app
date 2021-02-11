import { paths } from "App/paths";
import * as React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import TokenDetail from "./routes/TokenDetail";
import Tokens from "./routes/Tokens";

const {
  wallet: walletPaths,
  wallet: { params: walletParams },
} = paths;

export default function Wallet(): JSX.Element {
  const { path: basePath } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={basePath}>
        <Redirect to={{ pathname: `${basePath}${walletPaths.tokens}` }} />
      </Route>
      <Route exact path={`${basePath}${walletPaths.tokens}`}>
        <Tokens />
      </Route>
      <Route path={`${basePath}${walletPaths.tokens}${walletParams.tokenName}`}>
        <TokenDetail />
      </Route>
    </Switch>
  );
}
