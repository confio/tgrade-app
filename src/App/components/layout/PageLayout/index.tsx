import { Stack } from "App/components/layout";
import * as React from "react";
import { HTMLAttributes } from "react";
import { StyledCenter } from "./style";

export default function PageLayout({
  children,
  ...restProps
}: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  return (
    <StyledCenter tag="main" {...restProps}>
      <Stack gap="s8">{children}</Stack>
    </StyledCenter>
  );
}
