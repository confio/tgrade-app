import { UserError } from "App/pages/TMarket/utils";
import { createContext, HTMLAttributes, useContext, useReducer } from "react";
import { PoolProps } from "utils/tokens";

export type FormErrors = {
  from: UserError | undefined;
  to: UserError | undefined;
};

type tMarketAction =
  | {
      readonly type: "setSearchText";
      readonly payload: string | undefined;
    }
  | {
      readonly type: "setPool";
      readonly payload: PoolProps | undefined;
    }
  | {
      readonly type: "setEstimatingFromA";
      readonly payload: boolean;
    }
  | {
      readonly type: "setEstimatingFromB";
      readonly payload: boolean;
    };

type tMarketDispatch = (action: tMarketAction) => void;
type tMarketState = {
  readonly searchText: string | undefined;
  readonly pool: PoolProps | undefined;
  readonly estimatingFromA: boolean;
  readonly estimatingFromB: boolean;
};

type tMarketContextType =
  | {
      readonly tMarketDispatch: tMarketDispatch;
      readonly tMarketState: tMarketState;
    }
  | undefined;

const tMarketContext = createContext<tMarketContextType>(undefined);

function tMarketReducer(tMarketState: tMarketState, action: tMarketAction): tMarketState {
  switch (action.type) {
    case "setSearchText": {
      return { ...tMarketState, searchText: action.payload };
    }
    case "setPool": {
      return { ...tMarketState, pool: action.payload };
    }
    case "setEstimatingFromA": {
      return { ...tMarketState, estimatingFromA: action.payload };
    }
    case "setEstimatingFromB": {
      return { ...tMarketState, estimatingFromB: action.payload };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function setSearchText(dispatch: tMarketDispatch, text: string | undefined): void {
  dispatch({ type: "setSearchText", payload: text });
}
export function setPool(dispatch: tMarketDispatch, pool: PoolProps): void {
  dispatch({ type: "setPool", payload: pool });
}
export function setEstimatingFromA(dispatch: tMarketDispatch): void {
  dispatch({ type: "setEstimatingFromA", payload: true });
  dispatch({ type: "setEstimatingFromB", payload: false });
}
export function setEstimatingFromB(dispatch: tMarketDispatch): void {
  dispatch({ type: "setEstimatingFromB", payload: true });
  dispatch({ type: "setEstimatingFromA", payload: false });
}
export function setEstimatingSwitch(
  dispatch: tMarketDispatch,
  estimatingFromA: boolean,
  estimatingFromB: boolean,
): void {
  dispatch({ type: "setEstimatingFromB", payload: estimatingFromA });
  dispatch({ type: "setEstimatingFromA", payload: estimatingFromB });
}

export const useTMarket = (): NonNullable<tMarketContextType> => {
  const context = useContext(tMarketContext);

  if (context === undefined) {
    throw new Error("usetMarket must be used within a tMarketProvider");
  }

  return context;
};

export default function TMarketProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const [tMarketState, tMarketDispatch] = useReducer(tMarketReducer, {
    searchText: undefined,
    estimatingFromB: false,
    estimatingFromA: false,
    pool: undefined,
  });

  return (
    <tMarketContext.Provider value={{ tMarketState, tMarketDispatch }}>{children}</tMarketContext.Provider>
  );
}
