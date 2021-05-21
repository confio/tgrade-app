import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Home from "./routes/Home";

export default function Dso(): JSX.Element {
  const { path: basePath } = useRouteMatch();

  return (
    <Switch>
      <Route path={basePath}>
        <Home />
      </Route>
    </Switch>
  );
}
