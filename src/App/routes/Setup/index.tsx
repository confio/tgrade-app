import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Welcome from "./routes/Welcome";

export default function Setup(): JSX.Element {
  const { path: basePath } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={basePath}>
        <Welcome />
      </Route>
    </Switch>
  );
}
