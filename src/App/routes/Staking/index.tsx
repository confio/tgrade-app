import { pathValidators } from "App/paths";
import * as React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Validator from "./routes/Validator";
import Validators from "./routes/Validators";

const paramValidatorAddress = "/:validatorAddress";

export default function Staking(): JSX.Element {
  const { path: pathStakingMatched } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={pathStakingMatched}>
        <Redirect to={{ pathname: `${pathStakingMatched}${pathValidators}` }} />
      </Route>
      <Route exact path={`${pathStakingMatched}${pathValidators}`}>
        <Validators />
      </Route>
      <Route path={`${pathStakingMatched}${pathValidators}${paramValidatorAddress}`}>
        <Validator />
      </Route>
    </Switch>
  );
}
