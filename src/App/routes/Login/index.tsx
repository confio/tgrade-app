import { RedirectLocation } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { useSdk } from "service";
import ImportAccount from "./routes/ImportAccount";
import Menu from "./routes/Menu";
import UnlockAccount from "./routes/UnlockAccount";

export default function Login(): JSX.Element {
  const history = useHistory();
  const state = history.location.state as RedirectLocation;
  const { path: basePath } = useRouteMatch();
  const { initialized: isSdkInitialized } = useSdk();

  useEffect(() => {
    if (!isSdkInitialized) return;

    if (state) {
      history.push(state.redirectPathname, state.redirectState);
    } else {
      history.push(paths.wallet.prefix);
    }
  }, [history, isSdkInitialized, state]);

  return (
    <Switch>
      <Route exact path={basePath}>
        <Menu />
      </Route>
      <Route exact path={`${basePath}${paths.login.unlock}`}>
        <UnlockAccount />
      </Route>
      <Route exact path={`${basePath}${paths.login.import}`}>
        <ImportAccount />
      </Route>
    </Switch>
  );
}
