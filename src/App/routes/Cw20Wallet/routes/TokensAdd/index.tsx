import { paths } from "App/paths";
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import Add from "./routes/Add";
import Existing from "./routes/Existing";
import New from "./routes/New";

export default function TokensAdd(): JSX.Element {
  return (
    <Switch>
      <Route exact path={`${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAdd}`}>
        <Add />
      </Route>
      <Route
        exact
        path={`${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAddExisting}${paths.cw20Wallet.params.codeId}`}
      >
        <Existing />
      </Route>
      <Route exact path={`${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAddNew}`}>
        <New />
      </Route>
    </Switch>
  );
}
