import { paths } from "App/paths";
import { Redirect, Route, Switch } from "react-router-dom";
import TMarketProvider from "service/tmarket";
import Exchange from "./exchange/";
import Provide from "./provide/";
import Withdraw from "./withdraw";

export default function TMarket(): JSX.Element {
  return (
    <TMarketProvider>
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
    </TMarketProvider>
  );
}
