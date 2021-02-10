import { Button } from "antd";
import { PageLayout } from "App/components/layout";
import { pathWallet } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useError } from "service";
import failIcon from "./assets/failIcon.svg";
import successIcon from "./assets/successIcon.svg";
import { MainStack, ResultIcon, ResultText } from "./style";

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
  const { clearError } = useError();
  useEffect(clearError, [clearError]);

  const history = useHistory();

  const {
    success,
    message,
    error,
    customButtonText,
    customButtonActionPath,
    customButtonActionState,
  } = history.location.state as OperationResultState;

  function getResultContent(success: boolean): ResultContent {
    if (success) {
      return {
        result: "success",
        icon: successIcon,
        buttonText: "Home",
        buttonAction: () => history.push(pathWallet),
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
    <PageLayout hide="header">
      <MainStack>
        <ResultIcon src={icon} alt="Result icon" />
        <ResultText data-result={result}>{message}</ResultText>
        {error && <ResultText data-result={result}>{error}</ResultText>}
        <Button type="primary" onClick={chosenButtonAction}>
          {chosenButtonText}
        </Button>
      </MainStack>
    </PageLayout>
  );
}
