import * as React from "react";
import { createContext, HTMLAttributes, useContext, useReducer } from "react";
import { GlobalAntOverride, GlobalColors, GlobalFonts, GlobalReset, GlobalSpacing } from "theme/GlobalStyle";
import { ThemeDark } from "theme/GlobalStyle/ThemeDark";
import { ThemeLight } from "theme/GlobalStyle/ThemeLight";

type ThemeVariant = "light" | "dark";

type ThemeAction =
  | {
      readonly type: "setTheme";
      readonly payload: ThemeVariant;
    }
  | {
      readonly type: "toggleTheme";
    };

type ThemeDispatch = (action: ThemeAction) => void;
type ThemeState = {
  readonly theme: ThemeVariant;
};

type ThemeContextType =
  | {
      readonly themeState: ThemeState;
      readonly themeDispatch: ThemeDispatch;
    }
  | undefined;

const ThemeContext = createContext<ThemeContextType>(undefined);

function themeReducer({ theme: prevTheme }: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case "setTheme": {
      return { theme: action.payload };
    }
    case "toggleTheme": {
      return { theme: prevTheme === "light" ? "dark" : "light" };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function setThemeLight(dispatch: ThemeDispatch): void {
  dispatch({ type: "setTheme", payload: "light" });
}
export function setThemeDark(dispatch: ThemeDispatch): void {
  dispatch({ type: "setTheme", payload: "dark" });
}
export const toggleTheme = (dispatch: ThemeDispatch): void => dispatch({ type: "toggleTheme" });

export const useTheme = (): NonNullable<ThemeContextType> => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export default function ThemeProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const [themeState, themeDispatch] = useReducer(themeReducer, { theme: "dark" });

  return (
    <ThemeContext.Provider value={{ themeState, themeDispatch }}>
      <GlobalReset />
      <GlobalSpacing />
      <GlobalColors />
      {themeState.theme === "light" ? <ThemeLight /> : <ThemeDark />}
      <GlobalFonts />
      <GlobalAntOverride />
      {children}
    </ThemeContext.Provider>
  );
}
