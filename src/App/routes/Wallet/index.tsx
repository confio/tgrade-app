import { pathTokens } from "App/paths";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import TokenDetail from "./routes/TokenDetail";
import Tokens from "./routes/Tokens";

const paramTokenName = "/:tokenName";

export default function Wallet(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Redirect to={{ pathname: `${path}${pathTokens}` }} />
      </Route>
      <Route exact path={`${path}${pathTokens}`}>
        <Tokens />
      </Route>
      <Route path={`${path}${pathTokens}${paramTokenName}`}>
        <TokenDetail />
      </Route>
    </Switch>
  );
}
