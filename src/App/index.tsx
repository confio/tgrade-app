import TMarketHome from "App/pages/TMarket";
import { config } from "config/network";
import { i18n } from "i18n/config";
import { I18nextProvider } from "react-i18next";
import {
  QueryClient as ReactQueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "react-query";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { DsoProvider, ErrorProvider, LayoutProvider, SdkProvider, ThemeProvider } from "service";
import { paths } from "./paths";
import Dso from "./routes/Dso";

export default function App(): JSX.Element {
  return (
    <I18nextProvider i18n={i18n}>
      <ErrorProvider>
        <ReactQueryClientProvider client={new ReactQueryClient()}>
          <SdkProvider config={config}>
            <ThemeProvider>
              <Router basename={process.env.PUBLIC_URL}>
                <LayoutProvider>
                  <Switch>
                    <Route exact path="/">
                      <Redirect to={paths.dso.prefix} />
                    </Route>
                    <Route path={`${paths.dso.prefix}${paths.dso.params.dsoAddressOptional}`}>
                      <DsoProvider>
                        <Dso />
                      </DsoProvider>
                    </Route>
                    <Route path={`${paths.tmarket.prefix}`}>
                      <TMarketHome />
                    </Route>
                  </Switch>
                </LayoutProvider>
              </Router>
            </ThemeProvider>
          </SdkProvider>
        </ReactQueryClientProvider>
      </ErrorProvider>
    </I18nextProvider>
  );
}
