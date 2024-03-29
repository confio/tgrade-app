import { config } from "config/network";
import { i18n } from "i18n/config";
import { lazy, Suspense } from "react";
import { isMobile } from "react-device-detect";
import { ErrorBoundary } from "react-error-boundary";
import { I18nextProvider } from "react-i18next";
import {
  QueryClient as ReactQueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "react-query";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { DsoProvider, ErrorProvider, LayoutProvider, OcProvider, SdkProvider, ThemeProvider } from "service";
import TMarketProvider from "service/tmarket";
import TokensProvider from "service/tokens";

import ErrorFallback from "./components/ErrorFallback";
import { InformationMessage } from "./components/InformationMessage/style";
import LoadingSpinner from "./components/LoadingSpinner";
import CPoolHome from "./pages/CPoolHome";
import DocumentationPage from "./pages/DocumentationPage";
import ValidatorsHome from "./pages/ValidatorsHome";
import { paths } from "./paths";

const Dso = lazy(() => import("./routes/Dso"));
const Engagement = lazy(() => import("./pages/Engagement"));
const OcHome = lazy(() => import("./pages/OcHome"));
const TMarketHome = lazy(() => import("App/pages/TMarket"));
const NotFound = lazy(() => import("App/pages/NotFound"));

export default function App(): JSX.Element {
  const isCbdc = window.location.href.includes("cbdc");
  const basename = `${process.env.PUBLIC_URL}${isCbdc ? "/cbdc" : ""}`;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {isMobile ? (
        <InformationMessage>
          "Sorry, we don't support Mobile devices at this time. Please visit our website from a non-mobile
          device."
        </InformationMessage>
      ) : (
        <I18nextProvider i18n={i18n}>
          <ErrorProvider>
            <ReactQueryClientProvider client={new ReactQueryClient()}>
              <SdkProvider config={config}>
                <TokensProvider>
                  <OcProvider>
                    <Suspense fallback={null}>
                      <ThemeProvider>
                        <Router basename={basename}>
                          <LayoutProvider>
                            <Suspense fallback={<LoadingSpinner fullPage />}>
                              <Switch>
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
                                <Route path="*">
                                  <NotFound />
                                </Route>
                              </Switch>
                            </Suspense>
                          </LayoutProvider>
                        </Router>
                      </ThemeProvider>
                    </Suspense>
                  </OcProvider>
                </TokensProvider>
              </SdkProvider>
            </ReactQueryClientProvider>
          </ErrorProvider>
        </I18nextProvider>
      )}
    </ErrorBoundary>
  );
}
