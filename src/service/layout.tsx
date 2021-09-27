import { BackProps } from "App/components/BackButtonOrLink";
import { NavSidebar } from "App/components/NavSidebar";
import { paths } from "App/paths";
import { createContext, HTMLAttributes, useContext, useReducer } from "react";
import { useLocation } from "react-router-dom";

type ViewTitles = {
  readonly viewTitle?: string;
  readonly viewSubtitle?: string;
};

type LayoutAction =
  | {
      readonly type: "setBackButtonProps";
      readonly payload?: BackProps;
    }
  | {
      readonly type: "setTitles";
      readonly payload?: ViewTitles;
    }
  | {
      readonly type: "setLoading";
      readonly payload: boolean | string;
    };

type LayoutDispatch = (action: LayoutAction) => void;
type LayoutState = {
  readonly backButtonProps?: BackProps;
  readonly viewTitles?: ViewTitles;
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
    case "setBackButtonProps": {
      return { ...state, backButtonProps: action.payload };
    }
    case "setTitles": {
      return { ...state, viewTitles: action.payload };
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

export function setBackButtonProps(dispatch: LayoutDispatch, backButtonProps?: BackProps): void {
  dispatch({ type: "setBackButtonProps", payload: backButtonProps });
}

export function setTitles(dispatch: LayoutDispatch, viewTitles?: ViewTitles): void {
  dispatch({ type: "setTitles", payload: viewTitles });
}

export function setLoading(dispatch: LayoutDispatch, loading: boolean | string): void {
  dispatch({ type: "setLoading", payload: loading });
}

type InitialLayoutState = {
  [Property in keyof LayoutState]?: LayoutState[Property];
};

export function setInitialLayoutState(dispatch: LayoutDispatch, state?: InitialLayoutState): void {
  const { backButtonProps, viewTitles } = state ?? {};
  setBackButtonProps(dispatch, backButtonProps);
  setTitles(dispatch, viewTitles);
}

export const useLayout = (): NonNullable<LayoutContextType> => {
  const context = useContext(LayoutContext);

  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }

  return context;
};

export default function LayoutProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const [layoutState, layoutDispatch] = useReducer(layoutReducer, { isLoading: false });
  const { pathname } = useLocation();

  const showNavSidebar = pathname !== paths.root && pathname !== paths.documentation.prefix;

  return (
    <LayoutContext.Provider value={{ layoutState, layoutDispatch }}>
      <div style={{ display: "flex" }}>
        {showNavSidebar ? <NavSidebar /> : null}
        {children}
      </div>
    </LayoutContext.Provider>
  );
}
