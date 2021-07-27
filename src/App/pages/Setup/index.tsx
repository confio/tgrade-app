import { paths } from "App/paths";
import * as React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Tutorial from "./routes/Tutorial";
import Welcome from "./routes/Welcome";

export default function Setup(): JSX.Element {
  const { path: basePath } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={basePath}>
        <Redirect to={`${basePath}${paths.setup.welcome}`} />
      </Route>
      <Route path={`${basePath}${paths.setup.welcome}`}>
        <Welcome />
      </Route>
      <Route path={`${basePath}${paths.setup.tutorial}`}>
        <Tutorial />
      </Route>
      <Route>
        <Redirect to={`${basePath}${paths.setup.welcome}`} />
      </Route>
    </Switch>
  );
}
