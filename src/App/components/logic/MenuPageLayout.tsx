import * as React from "react";
import { HTMLAttributes } from "react";
import { useLayout } from "service/layout";
import { useWindowSize } from "utils/ui";
import { ErrorAlert, Loading, Menu, NavHeader } from ".";
import { PageLayout } from "../layout";

export default function MenuPageLayout({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const { hideMenu, loading, isMenuOpen, setMenuOpen, backButtonProps } = useLayout();

  const { width } = useWindowSize();
  const isBigViewport = width >= 1040;

  const showMenu = !hideMenu && loading === undefined;
  const showBurgerButton = !hideMenu && !isBigViewport;

  return (
    <>
      {showMenu ? (
        <Menu isBigViewport={isBigViewport} isOpen={isMenuOpen} closeMenu={() => setMenuOpen(false)} />
      ) : null}
      <PageLayout>
        <Loading loading={loading}>
          <NavHeader
            backButtonProps={backButtonProps}
            showBurgerButton={showBurgerButton}
            burgerButtonCallback={() => setMenuOpen(true)}
          />
          <ErrorAlert />
          {children}
        </Loading>
      </PageLayout>
    </>
  );
}
