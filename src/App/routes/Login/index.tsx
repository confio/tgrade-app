import { paths } from "App/paths";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ImportAccount from "./routes/ImportAccount";
import Menu from "./routes/Menu";
import UnlockAccount from "./routes/UnlockAccount";

export default function Login(): JSX.Element {
  const { path: basePath } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={basePath}>
        <Menu />
      </Route>
      <Route exact path={`${basePath}${paths.login.unlock}`}>
        <UnlockAccount />
      </Route>
      <Route exact path={`${basePath}${paths.login.import}`}>
        <ImportAccount />
      </Route>
    </Switch>
  );
}
