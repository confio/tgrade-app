import { paths } from "App/paths";
import { Route, Switch } from "react-router-dom";
import Withdraw from "./routes/withdraw";
import WithdrawProvider from "service/withdraw";
import WithdrawResult from "./routes/result";

export default function ExchangeSwitch(): JSX.Element {
  return (
    <WithdrawProvider>
      <Switch>
        <Route exact path={`${paths.tmarket.prefix}${paths.tmarket.withdraw.prefix}`}>
          <Withdraw />
        </Route>
        <Route
          exact
          path={`${paths.tmarket.prefix}${paths.tmarket.withdraw.prefix}${paths.tmarket.withdraw.result}`}
        >
          <WithdrawResult />
        </Route>
      </Switch>
    </WithdrawProvider>
  );
}
