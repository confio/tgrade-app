import * as React from "react";
import { ComponentProps } from "react";
import { useError } from "service";
import errorIcon from "./assets/errorIcon.svg";
import { StyledAlert } from "./style";

function ErrorIcon(): JSX.Element {
  return <img src={errorIcon} alt="Error Icon" />;
}

export default function ErrorAlert({ ...props }: ComponentProps<typeof StyledAlert>): JSX.Element {
  const { error, clearError } = useError();

  return error ? (
    <StyledAlert
      type="error"
      showIcon
      icon={<ErrorIcon />}
      closable
      afterClose={clearError}
      message={error}
      {...props}
    />
  ) : (
    <></>
  );
}
