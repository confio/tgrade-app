import { paths } from "App/paths";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Delegate from "./routes/Delegate";
import Detail from "./routes/Detail";
import Rewards from "./routes/Rewards";
import Undelegate from "./routes/Undelegate";

export default function Validator(): JSX.Element {
  const { path: basePath } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={basePath}>
        <Detail />
      </Route>
      <Route path={`${basePath}${paths.staking.delegate}`}>
        <Delegate />
      </Route>
      <Route path={`${basePath}${paths.staking.undelegate}`}>
        <Undelegate />
      </Route>
      <Route path={`${basePath}${paths.staking.rewards}`}>
        <Rewards />
      </Route>
    </Switch>
  );
}
