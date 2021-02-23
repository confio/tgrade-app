import { paths } from "App/paths";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Allowances from "./routes/Allowances";
import Detail from "./routes/Detail";
import Mint from "./routes/Mint";
import Send from "./routes/Send";

const {
  cw20Wallet: cw20WalletPaths,
  cw20Wallet: { params: cw20WalletParams },
} = paths;

export default function Token(): JSX.Element {
  const { path: basePath } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${basePath}${cw20WalletPaths.allowances}`}>
        <Allowances />
      </Route>
      <Route exact path={`${basePath}${cw20WalletPaths.mint}`}>
        <Mint />
      </Route>
      <Route exact path={`${basePath}${cw20WalletParams.allowingAddress}${cw20WalletPaths.send}`}>
        <Send />
      </Route>
      <Route exact path={`${basePath}${cw20WalletParams.allowingAddress}`}>
        <Detail />
      </Route>
    </Switch>
  );
}
