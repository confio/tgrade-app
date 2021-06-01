import { paths } from "App/paths";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import DsoHome from "./routes/DsoHome";
import EmptyDsos from "./routes/EmptyDsos";

export default function Dso(): JSX.Element {
  const { path: basePath } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={basePath}>
        <EmptyDsos />
      </Route>
      <Route path={`${basePath}${paths.dso.params.dsoAddress}`}>
        <DsoHome />
      </Route>
    </Switch>
  );
}
