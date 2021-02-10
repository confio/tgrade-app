import { pathTokens } from "App/paths";
import * as React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import TokenDetail from "./routes/TokenDetail";
import Tokens from "./routes/Tokens";

const paramTokenName = "/:tokenName";

export default function Wallet(): JSX.Element {
  const { path: pathWalletMatched } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={pathWalletMatched}>
        <Redirect to={{ pathname: `${pathWalletMatched}${pathTokens}` }} />
      </Route>
      <Route exact path={`${pathWalletMatched}${pathTokens}`}>
        <Tokens />
      </Route>
      <Route path={`${pathWalletMatched}${pathTokens}${paramTokenName}`}>
        <TokenDetail />
      </Route>
    </Switch>
  );
}
