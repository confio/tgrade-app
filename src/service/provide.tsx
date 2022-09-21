import { UserError } from "App/pages/TMarket/utils";
import { createContext, HTMLAttributes, useContext, useReducer } from "react";
import { DetailProvide, ExtraInfoProvide, Pair, PoolContract, SimulationProvide } from "utils/tokens";

export type FormErrors = {
  from: UserError | undefined;
  to: UserError | undefined;
};
export type provideButtonState =
  | {
      title: "Provide";
      type: "provide";
    }
  | { title: "Create Pair"; type: "create" }
  | { title: "Connect Wallet"; type: "connect_wallet" };

type ProvideAction =
  | {
      readonly type: "setIsTokenApprovedA";
      readonly payload: boolean;
    }
  | {
      readonly type: "setIsTokenApprovedB";
      readonly payload: boolean;
    }
  | {
      readonly type: "setIsPoolEmpty";
      readonly payload: boolean;
    }
  | {
      readonly type: "setSelectedPair";
      readonly payload: Pair | undefined;
    }
  | {
      readonly type: "setLoading";
      readonly payload: boolean;
    }
  | {
      readonly type: "setDisplayTip";
      readonly payload: boolean;
    }
  | {
      readonly type: "setProvideButtonState";
      readonly payload: provideButtonState;
    }
  | {
      readonly type: "setSimulationProvide";
      readonly payload: SimulationProvide | undefined;
    }
  | {
      readonly type: "setDetailProvide";
      readonly payload: DetailProvide | undefined;
    }
  | {
      readonly type: "setErrors";
      readonly payload: FormErrors;
    }
  | {
      readonly type: "setPool";
      readonly payload: PoolContract | undefined;
    }
  | {
      readonly type: "setExtraInfo";
      readonly payload: ExtraInfoProvide | undefined;
    };

type ProvideDispatch = (action: ProvideAction) => void;
type ProvideState = {
  readonly isTokenApprovedA: boolean;
  readonly isTokenApprovedB: boolean;
  readonly isPoolEmpty: boolean;
  readonly displayTip: boolean;
  readonly selectedPair: Pair | undefined;
  readonly extraInfo: ExtraInfoProvide | undefined;
  readonly loading: boolean;
  readonly provideButtonState: provideButtonState;
  readonly simulationProvide: SimulationProvide | undefined;
  readonly detailProvide: DetailProvide | undefined;
  readonly pool: PoolContract | undefined;
  readonly errors: FormErrors;
};

type ProvideContextType =
  | {
      readonly provideDispatch: ProvideDispatch;
      readonly provideState: ProvideState;
    }
  | undefined;

const ProvideContext = createContext<ProvideContextType>(undefined);

function ProvideReducer(ProvideState: ProvideState, action: ProvideAction): ProvideState {
  switch (action.type) {
    case "setIsTokenApprovedA": {
      return { ...ProvideState, isTokenApprovedA: action.payload };
    }
    case "setIsTokenApprovedB": {
      return { ...ProvideState, isTokenApprovedB: action.payload };
    }
    case "setIsPoolEmpty": {
      return { ...ProvideState, isPoolEmpty: action.payload };
    }
    case "setSelectedPair": {
      return { ...ProvideState, selectedPair: action.payload };
    }
    case "setLoading": {
      return { ...ProvideState, loading: action.payload };
    }
    case "setProvideButtonState": {
      return { ...ProvideState, provideButtonState: action.payload };
    }
    case "setSimulationProvide": {
      return { ...ProvideState, simulationProvide: action.payload };
    }
    case "setDetailProvide": {
      return { ...ProvideState, detailProvide: action.payload };
    }
    case "setPool": {
      return { ...ProvideState, pool: action.payload };
    }
    case "setErrors": {
      return { ...ProvideState, errors: action.payload };
    }
    case "setDisplayTip": {
      return { ...ProvideState, displayTip: action.payload };
    }
    case "setExtraInfo": {
      return { ...ProvideState, extraInfo: action.payload };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function setLoading(dispatch: ProvideDispatch, loading: boolean): void {
  dispatch({ type: "setLoading", payload: loading });
}

export function setSelectedPair(dispatch: ProvideDispatch, selectedPair: Pair | undefined): void {
  dispatch({ type: "setSelectedPair", payload: selectedPair });
}
export function setSimulationProvide(
  dispatch: ProvideDispatch,
  simulaton: SimulationProvide | undefined,
): void {
  dispatch({ type: "setSimulationProvide", payload: simulaton });
}
export function setDetailProvide(dispatch: ProvideDispatch, detailProvide: DetailProvide | undefined): void {
  dispatch({ type: "setDetailProvide", payload: detailProvide });
}
export function setErrors(dispatch: ProvideDispatch, errors: FormErrors): void {
  dispatch({ type: "setErrors", payload: errors });
}
export function setPool(dispatch: ProvideDispatch, pool: PoolContract | undefined): void {
  dispatch({ type: "setPool", payload: pool });
}
export function setIsTokenApprovedA(dispatch: ProvideDispatch, pool: boolean): void {
  dispatch({ type: "setIsTokenApprovedA", payload: pool });
}
export function setIsTokenApprovedB(dispatch: ProvideDispatch, pool: boolean): void {
  dispatch({ type: "setIsTokenApprovedB", payload: pool });
}
export function setIsPoolEmpty(dispatch: ProvideDispatch, isEmpty: boolean): void {
  dispatch({ type: "setIsPoolEmpty", payload: isEmpty });
}
export function setExtraInfo(dispatch: ProvideDispatch, info: ExtraInfoProvide | undefined): void {
  dispatch({ type: "setExtraInfo", payload: info });
}
export function setprovideButtonState(dispatch: ProvideDispatch, state: provideButtonState): void {
  dispatch({ type: "setProvideButtonState", payload: state });
}
export function setDisplayTip(dispatch: ProvideDispatch, display: boolean): void {
  dispatch({ type: "setDisplayTip", payload: display });
}
export const useProvide = (): NonNullable<ProvideContextType> => {
  const context = useContext(ProvideContext);

  if (context === undefined) {
    throw new Error("useProvide must be used within a ProvideProvider");
  }

  return context;
};

export default function ProvideProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const [provideState, provideDispatch] = useReducer(ProvideReducer, {
    isTokenApprovedA: false,
    isTokenApprovedB: false,
    isPoolEmpty: false,
    displayTip: true,
    loading: false,
    provideButtonState: {
      title: "Provide",
      type: "provide",
    },
    selectedPair: undefined,
    extraInfo: undefined,
    simulationProvide: undefined,
    detailProvide: undefined,
    errors: {
      from: undefined,
      to: undefined,
    },
    pool: undefined,
  });

  return (
    <ProvideContext.Provider value={{ provideState, provideDispatch }}>{children}</ProvideContext.Provider>
  );
}
