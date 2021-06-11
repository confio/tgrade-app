import { paths } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { resetSdk, useSdk } from "service";

export default function Logout(): JSX.Element {
  const { sdkDispatch } = useSdk();
  const history = useHistory();

  useEffect(() => {
    resetSdk(sdkDispatch);
    history.replace(`${paths.setup.prefix}${paths.setup.tutorial}`);
  }, [history, sdkDispatch]);

  return <></>;
}
