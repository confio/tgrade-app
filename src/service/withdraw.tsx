import { UserError } from "App/pages/TMarket/utils";
import { createContext, HTMLAttributes, useContext, useReducer } from "react";
import { DetailWithdraw, LPToken } from "utils/tokens";

export type FormErrors = {
  from: UserError | undefined;
  to: UserError | undefined;
};
export type WithdrawButtonState =
  | {
      title: "Confirm";
      type: "confirm";
    }
  | { title: "Connect Wallet"; type: "connect_wallet" };

type WithdrawAction =
  | {
      readonly type: "setSelected";
      readonly payload: LPToken | undefined;
    }
  | {
      readonly type: "setLoading";
      readonly payload: boolean;
    }
  | {
      readonly type: "setWithdrawButtonState";
      readonly payload: WithdrawButtonState;
    }
  | {
      readonly type: "setErrors";
      readonly payload: FormErrors;
    }
  | {
      readonly type: "setDetail";
      readonly payload: DetailWithdraw | undefined;
    };

type WithdrawDispatch = (action: WithdrawAction) => void;
type WithdrawState = {
  readonly selected: LPToken | undefined;
  readonly loading: boolean;
  readonly buttonState: WithdrawButtonState;
  readonly errors: FormErrors;
  readonly detail: DetailWithdraw | undefined;
};

type WithdrawContextType =
  | {
      readonly withdrawDispatch: WithdrawDispatch;
      readonly withdrawState: WithdrawState;
    }
  | undefined;

const WithdrawContext = createContext<WithdrawContextType>(undefined);

function WithdrawReducer(WithdrawState: WithdrawState, action: WithdrawAction): WithdrawState {
  switch (action.type) {
    case "setSelected": {
      return { ...WithdrawState, selected: action.payload };
    }
    case "setLoading": {
      return { ...WithdrawState, loading: action.payload };
    }
    case "setWithdrawButtonState": {
      return { ...WithdrawState, buttonState: action.payload };
    }
    case "setErrors": {
      return { ...WithdrawState, errors: action.payload };
    }
    case "setDetail": {
      return { ...WithdrawState, detail: action.payload };
    }

    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function setLoading(dispatch: WithdrawDispatch, loading: boolean): void {
  dispatch({ type: "setLoading", payload: loading });
}

export function setSelectedLP(dispatch: WithdrawDispatch, selected: LPToken | undefined): void {
  dispatch({ type: "setSelected", payload: selected });
}
export function setErrors(dispatch: WithdrawDispatch, errors: FormErrors): void {
  dispatch({ type: "setErrors", payload: errors });
}
export function setDetailWithdraw(dispatch: WithdrawDispatch, detail: DetailWithdraw | undefined): void {
  dispatch({ type: "setDetail", payload: detail });
}
export function setWithdrawButtonState(dispatch: WithdrawDispatch, detail: WithdrawButtonState): void {
  dispatch({ type: "setWithdrawButtonState", payload: detail });
}
export const useWithdraw = (): NonNullable<WithdrawContextType> => {
  const context = useContext(WithdrawContext);

  if (context === undefined) {
    throw new Error("useWithdraw must be used within a WithdrawWithdrawr");
  }

  return context;
};

export default function WithdrawProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const [withdrawState, withdrawDispatch] = useReducer(WithdrawReducer, {
    loading: false,
    selected: undefined,
    buttonState: { title: "Connect Wallet", type: "connect_wallet" },
    detail: undefined,
    errors: {
      from: undefined,
      to: undefined,
    },
  });

  return (
    <WithdrawContext.Provider value={{ withdrawState, withdrawDispatch }}>
      {children}
    </WithdrawContext.Provider>
  );
}
