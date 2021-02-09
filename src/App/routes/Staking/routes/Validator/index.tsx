import { pathDelegate, pathRewards, pathUndelegate } from "App/paths";
import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Delegate from "./routes/Delegate";
import Detail from "./routes/Detail";
import Rewards from "./routes/Rewards";
import Undelegate from "./routes/Undelegate";

export default function Validator(): JSX.Element {
  const { path: pathValidatorMatched } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={pathValidatorMatched}>
        <Detail />
      </Route>
      <Route path={`${pathValidatorMatched}${pathDelegate}`}>
        <Delegate />
      </Route>
      <Route path={`${pathValidatorMatched}${pathUndelegate}`}>
        <Undelegate />
      </Route>
      <Route path={`${pathValidatorMatched}${pathRewards}`}>
        <Rewards />
      </Route>
    </Switch>
  );
}
