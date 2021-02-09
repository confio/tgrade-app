import * as React from "react";
import { ComponentProps } from "react";
import { useError } from "service";
import { StyledAlert } from "./style";

export default function ErrorAlert({ ...props }: ComponentProps<typeof StyledAlert>): JSX.Element {
  const { error, clearError } = useError();

  return error ? (
    <StyledAlert type="error" showIcon closable afterClose={clearError} message={error} {...props} />
  ) : (
    <></>
  );
}
