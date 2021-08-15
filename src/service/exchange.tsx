import { UserError } from "App/pages/TMarket/utils";
import * as React from "react";
import { createContext, HTMLAttributes, useContext, useReducer } from "react";
import { DetailSwap, PairProps, PoolProps, SimulatedSwap, TokenProps } from "utils/tokens";

export type FormErrors = {
  from: UserError | undefined;
  to: UserError | undefined;
};
export type SwapButtonState =
  | {
      title: "Swap";
      type: "swap";
    }
  | { title: "Pair doesn't exist"; type: "not_exits" }
  | { title: "Connect Wallet"; type: "connect_wallet" }
  | { title: "Insufficient Liquidity"; type: "no_liquidity" };

type ExchangeAction =
  | {
      readonly type: "setTokens";
      readonly payload: readonly TokenProps[];
    }
  | {
      readonly type: "setFactoryAddress";
      readonly payload: string;
    }
  | {
      readonly type: "setPairs";
      readonly payload: readonly PairProps[];
    }
  | {
      readonly type: "setSelectedPair";
      readonly payload: PairProps | undefined;
    }
  | {
      readonly type: "setLoading";
      readonly payload: boolean;
    }
  | {
      readonly type: "setSwapButton";
      readonly payload: SwapButtonState;
    }
  | {
      readonly type: "setSimulatedSwap";
      readonly payload: SimulatedSwap | undefined;
    }
  | {
      readonly type: "setDetailSwap";
      readonly payload: DetailSwap | undefined;
    }
  | {
      readonly type: "setErrors";
      readonly payload: FormErrors;
    }
  | {
      readonly type: "setPool";
      readonly payload: PoolProps | undefined;
    };

type ExchangeDispatch = (action: ExchangeAction) => void;
type ExchangeState = {
  readonly selectedPair: PairProps | undefined;
  readonly loading: boolean;
  readonly swapButton: SwapButtonState;
  readonly simulatedSwap: SimulatedSwap | undefined;
  readonly detailSwap: DetailSwap | undefined;
  readonly errors: FormErrors;
};

type ExchangeContextType =
  | {
      readonly exchangeDispatch: ExchangeDispatch;
      readonly exchangeState: ExchangeState;
    }
  | undefined;

const ExchangeContext = createContext<ExchangeContextType>(undefined);

function ExchangeReducer(ExchangeState: ExchangeState, action: ExchangeAction): ExchangeState {
  switch (action.type) {
    case "setSelectedPair": {
      return { ...ExchangeState, selectedPair: action.payload };
    }
    case "setLoading": {
      return { ...ExchangeState, loading: action.payload };
    }
    case "setSwapButton": {
      return { ...ExchangeState, swapButton: action.payload };
    }
    case "setSimulatedSwap": {
      return { ...ExchangeState, simulatedSwap: action.payload };
    }
    case "setDetailSwap": {
      return { ...ExchangeState, detailSwap: action.payload };
    }
    case "setErrors": {
      return { ...ExchangeState, errors: action.payload };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function setLoading(dispatch: ExchangeDispatch, loading: boolean): void {
  dispatch({ type: "setLoading", payload: loading });
}
export function setSwapButton(dispatch: ExchangeDispatch, buttonState: SwapButtonState): void {
  dispatch({ type: "setSwapButton", payload: buttonState });
}
export function setSelectedPair(dispatch: ExchangeDispatch, selectedPair: PairProps | undefined): void {
  dispatch({ type: "setSelectedPair", payload: selectedPair });
}
export function setSimulatedSwap(dispatch: ExchangeDispatch, simulatedSwap: SimulatedSwap | undefined): void {
  dispatch({ type: "setSimulatedSwap", payload: simulatedSwap });
}
export function setDetailSwap(dispatch: ExchangeDispatch, detailSwap: DetailSwap | undefined): void {
  dispatch({ type: "setDetailSwap", payload: detailSwap });
}
export function setErrors(dispatch: ExchangeDispatch, errors: FormErrors): void {
  dispatch({ type: "setErrors", payload: errors });
}
export function setPool(dispatch: ExchangeDispatch, pool: PoolProps): void {
  dispatch({ type: "setPool", payload: pool });
}
export const useExchange = (): NonNullable<ExchangeContextType> => {
  const context = useContext(ExchangeContext);

  if (context === undefined) {
    throw new Error("useExchange must be used within a ExchangeProvider");
  }

  return context;
};

export default function ExchangeProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const [exchangeState, exchangeDispatch] = useReducer(ExchangeReducer, {
    loading: false,
    swapButton: {
      title: "Swap",
      type: "swap",
    },
    selectedPair: undefined,
    simulatedSwap: undefined,
    detailSwap: undefined,
    errors: {
      from: undefined,
      to: undefined,
    },
  });

  return (
    <ExchangeContext.Provider value={{ exchangeState, exchangeDispatch }}>
      {children}
    </ExchangeContext.Provider>
  );
}
