import { paths } from "App/paths";
import * as React from "react";
import { Route, Switch } from "react-router-dom";
import DsoHome from "./routes/DsoHome";
import EmptyDsos from "./routes/EmptyDsos";

export default function Dso(): JSX.Element {
  return (
    <Switch>
      <Route exact path={paths.dso.prefix}>
        <EmptyDsos />
      </Route>
      <Route path={`${paths.dso.prefix}${paths.dso.params.dsoAddress}`}>
        <DsoHome />
      </Route>
    </Switch>
  );
}
