import { config } from "config/network";
import { i18n } from "i18n/config";
import { lazy, Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import {
  QueryClient as ReactQueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "react-query";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { DsoProvider, ErrorProvider, LayoutProvider, SdkProvider, ThemeProvider } from "service";
import TMarketProvider from "service/tmarket";
import LoadingSpinner from "./components/LoadingSpinner";
import DocumentationPage from "./pages/DocumentationPage";
import LandingPage from "./pages/LandingPage";
import { paths } from "./paths";
const Dso = lazy(() => import("./routes/Dso"));
const TMarketHome = lazy(() => import("App/pages/TMarket"));
const CookiePolicy = lazy(() => import("App/pages/LandingPage/CookiePolicy"));
const PrivacyPolicy = lazy(() => import("App/pages/LandingPage/PrivacyPolicy"));
const Impressum = lazy(() => import("App/pages/LandingPage/Impressum"));

export default function App(): JSX.Element {
  return (
    <I18nextProvider i18n={i18n}>
      <ErrorProvider>
        <ReactQueryClientProvider client={new ReactQueryClient()}>
          <SdkProvider config={config}>
            <Suspense fallback={null}>
              <ThemeProvider>
                <Router basename={process.env.PUBLIC_URL}>
                  <LayoutProvider>
                    <Switch>
                      <Suspense fallback={<LoadingSpinner fullPage />}>
                        <Route exact path={paths.root}>
                          <LandingPage />
                        </Route>
                        <Route path={`${paths.privacypolicy.prefix}`}>
                          <PrivacyPolicy />
                        </Route>
                        <Route path={`${paths.cookiepolicy.prefix}`}>
                          <CookiePolicy />
                        </Route>
                        <Route path={`${paths.impressum.prefix}`}>
                          <Impressum />
                        </Route>
                        <Route path={`${paths.dso.prefix}${paths.dso.params.dsoAddressOptional}`}>
                          <DsoProvider>
                            <Dso />
                          </DsoProvider>
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
          </SdkProvider>
        </ReactQueryClientProvider>
      </ErrorProvider>
    </I18nextProvider>
  );
}
