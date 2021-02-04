import { config } from "config/network";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ErrorProvider, SdkProvider } from "service";
import GlobalStyle from "theme/GlobalStyle";
import { ProtectedSwitch } from "./components/logic";
import { pathLogin, pathOperationResult, pathWallet } from "./paths";
import Login from "./routes/Login";
import OperationResult from "./routes/OperationResult";
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
              <Route path={pathWallet}>
                <Wallet />
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
