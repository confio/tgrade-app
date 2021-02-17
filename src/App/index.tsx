import { config } from "config/network";
import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ErrorProvider, SdkProvider } from "service";
import GlobalStyle from "theme/GlobalStyle";
import { ProtectedSwitch } from "./components/logic";
import { paths } from "./paths";
import Account from "./routes/Account";
import Cw20Wallet from "./routes/Cw20Wallet";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import OperationResult from "./routes/OperationResult";
import Staking from "./routes/Staking";
import Wallet from "./routes/Wallet";

export default function App(): JSX.Element {
  return (
    <ErrorProvider>
      <SdkProvider config={config}>
        <GlobalStyle />
        <Router basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route path={paths.login}>
              <Login />
            </Route>
            <ProtectedSwitch authPath={paths.login}>
              <Route path={paths.logout}>
                <Logout />
              </Route>
              <Route path={paths.operationResult}>
                <OperationResult />
              </Route>
              <Route path={paths.account}>
                <Account />
              </Route>
              <Route path={paths.wallet.prefix}>
                <Wallet />
              </Route>
              <Route path={paths.cw20Wallet.prefix}>
                <Cw20Wallet />
              </Route>
              <Route path={paths.staking.prefix}>
                <Staking />
              </Route>
            </ProtectedSwitch>
          </Switch>
        </Router>
      </SdkProvider>
    </ErrorProvider>
  );
}
