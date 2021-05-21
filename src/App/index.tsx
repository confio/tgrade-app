import { config } from "config/network";
import { i18n } from "i18n/config";
import * as React from "react";
import { I18nextProvider } from "react-i18next";
import {
  QueryClient as ReactQueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "react-query";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { ContractsProvider, ErrorProvider, LayoutProvider, SdkProvider } from "service";
import ThemeProvider from "service/theme";
import { ProtectedSwitch } from "./components/logic";
import { paths } from "./paths";
import Account from "./routes/Account";
import Cw20Wallet from "./routes/Cw20Wallet";
import Dso from "./routes/Dso";
import Logout from "./routes/Logout";
import OperationResult from "./routes/OperationResult";
import Setup from "./routes/Setup";
import Staking from "./routes/Staking";
import Wallet from "./routes/Wallet";

export default function App(): JSX.Element {
  return (
    <I18nextProvider i18n={i18n}>
      <ErrorProvider>
        <ReactQueryClientProvider client={new ReactQueryClient()}>
          <SdkProvider config={config}>
            <ContractsProvider>
              <ThemeProvider>
                <Router basename={process.env.PUBLIC_URL}>
                  <LayoutProvider>
                    <Switch>
                      <Route exact path="/">
                        <Redirect to={paths.setup.prefix} />
                      </Route>
                      <Route path={paths.setup.prefix}>
                        <Setup />
                      </Route>
                      <ProtectedSwitch authPath={paths.setup.prefix}>
                        <Route path={paths.logout}>
                          <Logout />
                        </Route>
                        <Route path={paths.operationResult}>
                          <OperationResult />
                        </Route>
                        <Route path={paths.account.prefix}>
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
                        <Route path={paths.dso.prefix}>
                          <Dso />
                        </Route>
                      </ProtectedSwitch>
                    </Switch>
                  </LayoutProvider>
                </Router>
              </ThemeProvider>
            </ContractsProvider>
          </SdkProvider>
        </ReactQueryClientProvider>
      </ErrorProvider>
    </I18nextProvider>
  );
}
