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
  const { path: pathWalletMatched } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={pathWalletMatched}>
        <Redirect to={{ pathname: `${pathWalletMatched}${walletPaths.tokens}` }} />
      </Route>
      <Route exact path={`${pathWalletMatched}${walletPaths.tokens}`}>
        <Tokens />
      </Route>
      <Route path={`${pathWalletMatched}${walletPaths.tokens}${walletParams.tokenName}`}>
        <TokenDetail />
      </Route>
    </Switch>
  );
}
