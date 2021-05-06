import { CorporateBannerLayout } from "App/components/layout";
import { BackButton, Menu, RedirectLocation } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { ComponentProps, createContext, HTMLAttributes, useContext, useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { hitFaucetIfNeeded, isSdkInitialized, useSdkInit } from "service";
import { useWindowSize } from "utils/ui";

type MenuState = "open" | "closed" | "hidden";

type LayoutAction =
  | {
      readonly type: "setMenu";
      readonly payload: MenuState;
    }
  | {
      readonly type: "setBackButtonProps";
      readonly payload?: ComponentProps<typeof BackButton>;
    }
  | {
      readonly type: "setLoading";
      readonly payload: boolean | string;
    };

type LayoutDispatch = (action: LayoutAction) => void;
type LayoutState = {
  readonly menuState: MenuState;
  readonly backButtonProps?: ComponentProps<typeof BackButton>;
  readonly isLoading: boolean;
  readonly loadingMsg?: string;
};

type LayoutContextType =
  | {
      readonly layoutState: LayoutState;
      readonly layoutDispatch: LayoutDispatch;
    }
  | undefined;

const LayoutContext = createContext<LayoutContextType>(undefined);

function layoutReducer(state: LayoutState, action: LayoutAction): LayoutState {
  switch (action.type) {
    case "setMenu": {
      return { ...state, menuState: action.payload };
    }
    case "setBackButtonProps": {
      return { ...state, backButtonProps: action.payload };
    }
    case "setLoading": {
      if (typeof action.payload === "boolean") {
        return { ...state, isLoading: action.payload, loadingMsg: undefined };
      }

      return { ...state, isLoading: true, loadingMsg: action.payload };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export const hideMenu = (dispatch: LayoutDispatch): void => dispatch({ type: "setMenu", payload: "hidden" });
export const openMenu = (dispatch: LayoutDispatch): void => dispatch({ type: "setMenu", payload: "open" });
export const closeMenu = (dispatch: LayoutDispatch): void => dispatch({ type: "setMenu", payload: "closed" });
export const showMenu = closeMenu;

export function setBackButtonProps(
  dispatch: LayoutDispatch,
  backButtonProps?: ComponentProps<typeof BackButton>,
): void {
  dispatch({ type: "setBackButtonProps", payload: backButtonProps });
}

export function setLoading(dispatch: LayoutDispatch, loading: boolean | string): void {
  dispatch({ type: "setLoading", payload: loading });
}

type InitialLayoutState = {
  [Property in keyof LayoutState]?: LayoutState[Property];
};

export function setInitialLayoutState(dispatch: LayoutDispatch, state?: InitialLayoutState): void {
  const { backButtonProps, menuState } = state || { backButtonProps: undefined, menuState: undefined };
  setBackButtonProps(dispatch, backButtonProps);

  switch (menuState) {
    case "open": {
      openMenu(dispatch);
      break;
    }
    case "hidden": {
      hideMenu(dispatch);
      break;
    }
    default: {
      closeMenu(dispatch);
    }
  }
}

export const useLayout = (): NonNullable<LayoutContextType> => {
  const context = useContext(LayoutContext);

  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }

  return context;
};

export default function LayoutProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const { t } = useTranslation("login");
  const history = useHistory();
  const state = history.location.state as RedirectLocation;
  const { sdkState } = useSdkInit();
  const [layoutState, layoutDispatch] = useReducer(layoutReducer, { menuState: "hidden", isLoading: false });

  useEffect(() => {
    (async function loginIfInitialized() {
      if (!isSdkInitialized(sdkState) || layoutState.loadingMsg !== t("initializing")) return;

      await hitFaucetIfNeeded(sdkState);

      if (state) {
        history.push(state.redirectPathname, state.redirectState);
      } else {
        history.push(paths.wallet.prefix);
      }

      setLoading(layoutDispatch, false);
    })();
  }, [history, layoutState.loadingMsg, sdkState, state, t]);

  const { width } = useWindowSize();
  const showMenu = layoutState.menuState !== "hidden" && !layoutState.isLoading;
  const showCorporateBanner = true;

  return (
    <LayoutContext.Provider value={{ layoutState, layoutDispatch }}>
      <>
        {showMenu ? (
          <Menu
            isBigViewport={width >= 1040}
            isOpen={layoutState.menuState === "open"}
            closeMenu={() => closeMenu(layoutDispatch)}
          />
        ) : null}
        {showCorporateBanner ? <CorporateBannerLayout>{children}</CorporateBannerLayout> : children}
      </>
    </LayoutContext.Provider>
  );
}
