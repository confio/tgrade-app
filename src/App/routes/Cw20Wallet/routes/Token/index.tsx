import { paths } from "App/paths";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Allowances from "./routes/Allowances";
import Detail from "./routes/Detail";
import Mint from "./routes/Mint";
import Send from "./routes/Send";

export default function Token(): JSX.Element {
  const { path: basePath } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={basePath}>
        <Detail />
      </Route>
      <Route exact path={`${basePath}${paths.cw20Wallet.send}`}>
        <Send />
      </Route>
      <Route path={`${basePath}${paths.cw20Wallet.allowances}`}>
        <Allowances />
      </Route>
      <Route path={`${basePath}${paths.cw20Wallet.mint}`}>
        <Mint />
      </Route>
    </Switch>
  );
}
