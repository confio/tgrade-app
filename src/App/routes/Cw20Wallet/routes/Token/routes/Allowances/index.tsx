import { paths } from "App/paths";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Add from "./routes/Add";
import Detail from "./routes/Detail";
import Edit from "./routes/Edit";
import List from "./routes/List";

const {
  cw20Wallet: cw20WalletPaths,
  cw20Wallet: { params: cw20WalletParams },
} = paths;

export default function Allowances(): JSX.Element {
  const { path: basePath } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${basePath}`}>
        <List />
      </Route>
      <Route exact path={`${basePath}${cw20WalletPaths.add}`}>
        <Add />
      </Route>
      <Route exact path={`${basePath}${cw20WalletParams.spenderAddress}`}>
        <Detail />
      </Route>
      <Route exact path={`${basePath}${cw20WalletParams.spenderAddress}${cw20WalletPaths.edit}`}>
        <Edit />
      </Route>
    </Switch>
  );
}
