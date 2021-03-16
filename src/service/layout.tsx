import { BackButton } from "App/components/logic";
import * as React from "react";
import { ComponentProps, createContext, HTMLAttributes, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSdk } from "service";

interface LayoutState {
  readonly hideMenu?: boolean;
  readonly backButtonProps?: ComponentProps<typeof BackButton>;
}

interface LayoutContextType {
  readonly hideMenu: boolean;
  readonly setHideMenu: (hideMenu: boolean) => void;
  readonly backButtonProps?: ComponentProps<typeof BackButton>;
  readonly setBackButtonProps: (backButtonProps?: ComponentProps<typeof BackButton>) => void;
  readonly isMenuOpen: boolean;
  readonly setMenuOpen: (isMenuOpen: boolean) => void;
  readonly loading?: string;
  readonly setLoading: (loading: boolean | string) => void;
}

const defaultContext: LayoutContextType = {
  hideMenu: true,
  setHideMenu: () => {},
  setBackButtonProps: () => {},
  isMenuOpen: false,
  setMenuOpen: () => {},
  setLoading: () => {},
};

const LayoutContext = createContext<LayoutContextType>(defaultContext);

export const useLayout = (state?: LayoutState): LayoutContextType => {
  const context = useContext(LayoutContext);

  useEffect(() => {
    if (!state) return;

    const { hideMenu, backButtonProps } = state;
    context.setHideMenu(!!hideMenu);
    context.setBackButtonProps(backButtonProps);
  }, [context, state]);

  return context;
};

export default function LayoutProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const { t } = useTranslation("login");
  const { initialized: isSdkInitialized } = useSdk();

  const [hideMenu, setHideMenu] = useState(true);
  const [backButtonProps, setBackButtonProps] = useState<ComponentProps<typeof BackButton>>();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState<string>();

  useEffect(() => {
    if (isSdkInitialized && loading === t("initializing")) {
      setLoading(undefined);
    }
  }, [isSdkInitialized, loading, t]);

  const readyContext: LayoutContextType = {
    hideMenu,
    setHideMenu,
    backButtonProps,
    setBackButtonProps,
    isMenuOpen,
    setMenuOpen,
    loading,
    setLoading: (loading) => {
      if (typeof loading === "boolean") {
        setLoading(loading ? "Loading..." : undefined);
      }

      if (typeof loading === "string") {
        setLoading(loading);
      }
    },
  };

  return <LayoutContext.Provider value={readyContext}>{children}</LayoutContext.Provider>;
}
