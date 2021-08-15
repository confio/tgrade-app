import { paths } from "App/paths";
import { Route, Switch } from "react-router-dom";
import ProvideProvider from "service/provide";
import Provide from "./routes/provide";
import ProvideResult from "./routes/result";

export default function ExchangeSwitch(): JSX.Element {
  return (
    <ProvideProvider>
      <Switch>
        <Route exact path={`${paths.tmarket.prefix}${paths.tmarket.provide.prefix}`}>
          <Provide />
        </Route>
        <Route
          exact
          path={`${paths.tmarket.prefix}${paths.tmarket.provide.prefix}${paths.tmarket.provide.result}`}
        >
          <ProvideResult />
        </Route>
      </Switch>
    </ProvideProvider>
  );
}
