import { paths } from "App/paths";
import { Redirect, Route, Switch } from "react-router-dom";
import ExchangeProvider from "service/exchange";
import ProvideProvider from "service/provide";
import WithdrawProvider from "service/withdraw";
import Exchange from "./exchange";
import Provide from "./provide";
import Withdraw from "./withdraw";

export default function TMarket(): JSX.Element {
  return (
    <Switch>
      <Route path={`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}`}>
        <ExchangeProvider>
          <Exchange />
        </ExchangeProvider>
      </Route>
      <Route path={`${paths.tmarket.prefix}${paths.tmarket.provide.prefix}`}>
        <ProvideProvider>
          <Provide />
        </ProvideProvider>
      </Route>
      <Route
        path={[
          `${paths.tmarket.prefix}${paths.tmarket.withdraw.prefix}${paths.tmarket.withdraw.result}`,
          `${paths.tmarket.prefix}${paths.tmarket.withdraw.prefix}`,
        ]}
      >
        <WithdrawProvider>
          <Withdraw />
        </WithdrawProvider>
      </Route>
      <Route exact path={paths.tmarket.prefix}>
        <Redirect to={`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}`} />
      </Route>
    </Switch>
  );
}
