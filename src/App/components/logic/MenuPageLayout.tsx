import * as React from "react";
import { HTMLAttributes } from "react";
import { closeMenu, openMenu, useLayout } from "service/layout";
import { useWindowSize } from "utils/ui";
import { ErrorAlert, Loading, Menu, NavHeader } from ".";
import { PageLayout } from "../layout";

export default function MenuPageLayout({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const {
    layoutState: { menuState, backButtonProps, isLoading, loadingMsg },
    layoutDispatch,
  } = useLayout();

  const { width } = useWindowSize();
  const isBigViewport = width >= 1040;

  const showMenu = menuState !== "hidden" && !isLoading;
  const showBurgerButton = menuState !== "hidden" && !isBigViewport;

  return (
    <>
      {showMenu ? (
        <Menu
          isBigViewport={isBigViewport}
          isOpen={menuState === "open"}
          closeMenu={() => closeMenu(layoutDispatch)}
        />
      ) : null}
      <PageLayout>
        <Loading loading={loadingMsg}>
          <NavHeader
            backButtonProps={backButtonProps}
            showBurgerButton={showBurgerButton}
            burgerButtonCallback={() => openMenu(layoutDispatch)}
          />
          <ErrorAlert />
          {children}
        </Loading>
      </PageLayout>
    </>
  );
}
