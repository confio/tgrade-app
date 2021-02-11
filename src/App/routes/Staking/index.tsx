import { paths } from "App/paths";
import * as React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Validator from "./routes/Validator";
import Validators from "./routes/Validators";

const {
  staking: stakingPaths,
  staking: { params: stakingParams },
} = paths;

export default function Staking(): JSX.Element {
  const { path: basePath } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={basePath}>
        <Redirect to={{ pathname: `${basePath}${stakingPaths.validators}` }} />
      </Route>
      <Route exact path={`${basePath}${stakingPaths.validators}`}>
        <Validators />
      </Route>
      <Route path={`${basePath}${stakingPaths.validators}${stakingParams.validatorAddress}`}>
        <Validator />
      </Route>
    </Switch>
  );
}
