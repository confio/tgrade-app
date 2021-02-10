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
  const { path: pathStakingMatched } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={pathStakingMatched}>
        <Redirect to={{ pathname: `${pathStakingMatched}${stakingPaths.validators}` }} />
      </Route>
      <Route exact path={`${pathStakingMatched}${stakingPaths.validators}`}>
        <Validators />
      </Route>
      <Route path={`${pathStakingMatched}${stakingPaths.validators}${stakingParams.validatorAddress}`}>
        <Validator />
      </Route>
    </Switch>
  );
}
