import { config } from "config/network";
import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ErrorProvider, SdkProvider } from "service";
import GlobalStyle from "theme/GlobalStyle";
import { ProtectedSwitch } from "./components/logic";
import { pathAccount, pathLogin, pathLogout, pathOperationResult, pathStaking, pathWallet } from "./paths";
import Account from "./routes/Account";
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
            <Route path={pathLogin}>
              <Login />
            </Route>
            <ProtectedSwitch authPath={pathLogin}>
              <Route path={pathLogout}>
                <Logout />
              </Route>
              <Route path={pathAccount}>
                <Account />
              </Route>
              <Route path={pathWallet}>
                <Wallet />
              </Route>
              <Route path={pathStaking}>
                <Staking />
              </Route>
              <Route path={pathOperationResult}>
                <OperationResult />
              </Route>
            </ProtectedSwitch>
          </Switch>
        </Router>
      </SdkProvider>
    </ErrorProvider>
  );
}
