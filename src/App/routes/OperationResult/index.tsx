import { Button } from "antd";
import { Stack } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useError } from "service";
import { useLayout } from "service/layout";
import failIcon from "./assets/failIcon.svg";
import successIcon from "./assets/successIcon.svg";
import { ResultIcon, ResultText } from "./style";

export interface OperationResultState {
  readonly success: boolean;
  readonly message: string;
  readonly error?: string;
  readonly customButtonText?: string;
  readonly customButtonActionPath?: string;
  readonly customButtonActionState?: any;
}

interface ResultContent {
  readonly result: "success" | "failure";
  readonly icon: string;
  readonly buttonText: string;
  readonly buttonAction: () => void;
}

export default function OperationResult(): JSX.Element {
  const history = useHistory();
  console.log("OR state: ", history.location.state);
  const {
    success,
    message,
    error,
    customButtonText,
    customButtonActionPath,
    customButtonActionState,
  } = history.location.state as OperationResultState;

  useLayout({ hideMenu: true });

  const { clearError } = useError();
  useEffect(clearError, [clearError]);

  function getResultContent(success: boolean): ResultContent {
    if (success) {
      return {
        result: "success",
        icon: successIcon,
        buttonText: "Home",
        buttonAction: () => history.push(paths.wallet.prefix),
      };
    }

    return {
      result: "failure",
      icon: failIcon,
      buttonText: "Retry",
      buttonAction: history.goBack,
    };
  }

  const { icon, result, buttonText, buttonAction } = getResultContent(success);

  const chosenButtonText = customButtonText || buttonText;
  const chosenButtonAction = customButtonActionPath
    ? () => history.push(customButtonActionPath, customButtonActionState)
    : buttonAction;

  return (
    <Stack gap="s3">
      <ResultIcon src={icon} alt="Result icon" />
      <ResultText data-result={result}>{message}</ResultText>
      {error && <ResultText data-result={result}>{error}</ResultText>}
      <Button type="primary" onClick={chosenButtonAction}>
        {chosenButtonText}
      </Button>
    </Stack>
  );
}
