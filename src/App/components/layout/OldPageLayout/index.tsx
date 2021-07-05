import { Stack } from "App/components/layoutPrimitives";
import { ErrorAlert, Loading, NavHeader } from "App/components/logic";
import * as React from "react";
import { HTMLAttributes } from "react";
import { openMenu, useLayout } from "service";
import { useWindowSize } from "utils/ui";
import StyledOldPageLayout from "./style";

export default function OldPageLayout({
  children,
  ...restProps
}: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const {
    layoutState: { menuState, backButtonProps, loadingMsg },
    layoutDispatch,
  } = useLayout();
  const { width } = useWindowSize();

  const showBurgerButton = menuState !== "hidden" && width < 1040;

  return (
    <StyledOldPageLayout tag="main" {...restProps}>
      <Stack gap="s8">
        <Loading loading={loadingMsg}>
          <NavHeader
            backButtonProps={backButtonProps}
            showBurgerButton={showBurgerButton}
            burgerButtonCallback={() => openMenu(layoutDispatch)}
          />
          <ErrorAlert />
          {children}
        </Loading>
      </Stack>
    </StyledOldPageLayout>
  );
}
