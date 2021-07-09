import { Stack } from "App/components/layoutPrimitives";
import { ErrorAlert, Loading, NavHeader } from "App/components/logic";
import * as React from "react";
import { HTMLAttributes } from "react";
import { useLayout } from "service";
import StyledOldPageLayout from "./style";

export default function OldPageLayout({
  children,
  ...restProps
}: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const {
    layoutState: { backButtonProps, loadingMsg },
    layoutDispatch,
  } = useLayout();

  return (
    <StyledOldPageLayout tag="main" {...restProps}>
      <Stack gap="s8">
        <Loading loading={loadingMsg}>
          <NavHeader />
          <ErrorAlert />
          {children}
        </Loading>
      </Stack>
    </StyledOldPageLayout>
  );
}
