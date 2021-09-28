import { paths } from "App/paths";
import { lazy } from "react";
import { Route, Switch } from "react-router-dom";

const EmptyDsos = lazy(() => import("../../pages/EmptyDsos"));
const DsoHome = lazy(() => import("../../pages/DsoHome"));

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
