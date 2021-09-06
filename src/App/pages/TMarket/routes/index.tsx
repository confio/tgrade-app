import { paths } from "App/paths";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import TMarketPageLayout from "App/components/TMarketPageLayout";
import Exchange from "./exchange/";
import Provide from "./provide/";
import Withdraw from "./withdraw";

export default function TMarket(): JSX.Element {
  return (
    <TMarketPageLayout>
      <Switch>
        <Route path={`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}`}>
          <Exchange />
        </Route>
        <Route path={`${paths.tmarket.prefix}${paths.tmarket.provide.prefix}`}>
          <Provide />
        </Route>
        <Route path={`${paths.tmarket.prefix}${paths.tmarket.withdraw.prefix}`}>
          <Withdraw />
        </Route>
        <Route exact path={paths.tmarket.prefix}>
          <Redirect to={`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}`} />
        </Route>
      </Switch>
    </TMarketPageLayout>
  );
}
