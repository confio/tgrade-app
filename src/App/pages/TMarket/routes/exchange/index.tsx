import { paths } from "App/paths";
import { Route, Switch } from "react-router-dom";
import ExchangeProvider from "service/exchange";
import Exchange from "./routes/exchange";
import ExchangeResult from "./routes/result";

export default function ExchangeSwitch(): JSX.Element {
  return (
    <ExchangeProvider>
      <Switch>
        <Route exact path={`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}`}>
          <Exchange />
        </Route>
        <Route
          exact
          path={`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}${paths.tmarket.exchange.result}`}
        >
          <ExchangeResult />
        </Route>
      </Switch>
    </ExchangeProvider>
  );
}
