import { PageLayout } from "App/components/layout";
import { BackButton, ErrorAlert, Loading, Menu, NavHeader, RedirectLocation } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { ComponentProps, createContext, HTMLAttributes, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSdk } from "service";
import { useWindowSize } from "utils/ui";

interface LayoutState {
  readonly hideMenu?: boolean;
  readonly backButtonProps?: ComponentProps<typeof BackButton>;
}

interface LayoutContextType {
  readonly setHideMenu: (hideMenu: boolean) => void;
  readonly setBackButtonProps: (backButtonProps?: ComponentProps<typeof BackButton>) => void;
  readonly setLoading: (loading: boolean | string) => void;
}

const defaultContext: LayoutContextType = {
  setHideMenu: () => {},
  setBackButtonProps: () => {},
  setLoading: () => {},
};

const LayoutContext = createContext<LayoutContextType>(defaultContext);

export const useLayout = (state?: LayoutState): LayoutContextType => {
  const context = useContext(LayoutContext);
  const { hideMenu, backButtonProps } = state ?? {};

  useEffect(() => {
    context.setHideMenu(!!hideMenu);
    context.setBackButtonProps(backButtonProps);
  }, [backButtonProps, context, hideMenu]);

  return context;
};

export default function LayoutProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const history = useHistory();
  const state = history.location.state as RedirectLocation;
  const { initialized: isSdkInitialized } = useSdk();

  const { width } = useWindowSize();
  const isBigViewport = width >= 1040;

  const [hideMenu, setHideMenu] = useState(true);
  const [backButtonProps, setBackButtonProps] = useState<ComponentProps<typeof BackButton>>();
  const [loading, setLoading] = useState<string>();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const readyContext: LayoutContextType = {
    setHideMenu,
    setBackButtonProps,
    setLoading: (loading) => {
      if (typeof loading === "boolean") {
        setLoading(loading ? "Loading..." : undefined);
      }

      if (typeof loading === "string") {
        setLoading(loading);
      }
    },
  };

  useEffect(() => {
    if (!isSdkInitialized) return;
    setLoading(undefined);

    if (state) {
      history.push(state.redirectPathname, state.redirectState);
    } else {
      history.push(paths.wallet.prefix);
    }
  }, [history, isSdkInitialized, state]);

  const showMenu = !hideMenu && loading === undefined;
  const showBurgerButton = !hideMenu && !isBigViewport;

  return (
    <LayoutContext.Provider value={readyContext}>
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
    </LayoutContext.Provider>
  );
}
