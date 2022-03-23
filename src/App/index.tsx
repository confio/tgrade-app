import { config } from "config/network";
import { i18n } from "i18n/config";
import { lazy, Suspense } from "react";
import { isMobile } from "react-device-detect";
import { I18nextProvider } from "react-i18next";
import {
  QueryClient as ReactQueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "react-query";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { DsoProvider, ErrorProvider, LayoutProvider, OcProvider, SdkProvider, ThemeProvider } from "service";
import TMarketProvider from "service/tmarket";
import styled from "styled-components";

import LoadingSpinner from "./components/LoadingSpinner";
import CPoolHome from "./pages/CPoolHome";
import DocumentationPage from "./pages/DocumentationPage";
import ValidatorsHome from "./pages/ValidatorsHome";
import { paths } from "./paths";

const Dso = lazy(() => import("./routes/Dso"));
const Engagement = lazy(() => import("./pages/Engagement"));
const OcHome = lazy(() => import("./pages/OcHome"));
const TMarketHome = lazy(() => import("App/pages/TMarket"));

export const WarningMessage = styled.h1`
  margin: 50px;
  text-align: center;
`;

export default function App(): JSX.Element {
  return (
    <>
      {isMobile ? (
        <WarningMessage>
          "Sorry, we don't support Mobile devices at this time. Please visit our website from a non-mobile
          device."
        </WarningMessage>
      ) : (
        <I18nextProvider i18n={i18n}>
          <ErrorProvider>
            <ReactQueryClientProvider client={new ReactQueryClient()}>
              <SdkProvider config={config}>
                <OcProvider>
                  <Suspense fallback={null}>
                    <ThemeProvider>
                      <Router basename={process.env.PUBLIC_URL}>
                        <LayoutProvider>
                          <Switch>
                            <Suspense fallback={<LoadingSpinner fullPage />}>
                              <Route exact path={paths.root}>
                                <Redirect to={`${paths.dso.prefix}`} />
                              </Route>
                              <Route path={`${paths.dso.prefix}${paths.dso.params.dsoAddressOptional}`}>
                                <DsoProvider>
                                  <Dso />
                                </DsoProvider>
                              </Route>
                              <Route path={paths.engagement.prefix}>
                                <Engagement />
                              </Route>
                              <Route path={paths.validators.prefix}>
                                <ValidatorsHome />
                              </Route>
                              <Route path={paths.oc.prefix}>
                                <OcHome />
                              </Route>
                              <Route path={paths.cpool.prefix}>
                                <CPoolHome />
                              </Route>
                              <Route path={`${paths.tmarket.prefix}`}>
                                <TMarketProvider>
                                  <TMarketHome />
                                </TMarketProvider>
                              </Route>
                              <Route path={`${paths.documentation.prefix}`}>
                                <DocumentationPage />
                              </Route>
                            </Suspense>
                          </Switch>
                        </LayoutProvider>
                      </Router>
                    </ThemeProvider>
                  </Suspense>
                </OcProvider>
              </SdkProvider>
            </ReactQueryClientProvider>
          </ErrorProvider>
        </I18nextProvider>
      )}
    </>
  );
}
