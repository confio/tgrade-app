import { pathLogin } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSdk } from "service";

export default function Logout(): JSX.Element {
  const { clear } = useSdk();
  const history = useHistory();

  useEffect(() => {
    clear();
    history.replace(pathLogin);
  }, [clear, history]);

  return <></>;
}
