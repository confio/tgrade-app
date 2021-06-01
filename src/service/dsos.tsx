import { AddDsoModal } from "App/components/logic";
import * as React from "react";
import { createContext, HTMLAttributes, useContext, useEffect, useReducer } from "react";
import { useLocalStorage } from "utils/storage";

type DsoTuple = readonly [string, string];
type ModalState = "open" | "closed";

type DsoAction =
  | {
      readonly type: "addDso";
      readonly payload: DsoTuple;
    }
  | {
      readonly type: "removeDso";
      readonly payload: string;
    }
  | {
      readonly type: "setAddDsoModal";
      readonly payload: ModalState;
    };

type DsoDispatch = (action: DsoAction) => void;
type DsoState = {
  readonly dsos: readonly DsoTuple[];
  readonly addDsoModalState: ModalState;
};

type DsoContextType =
  | {
      readonly dsoState: DsoState;
      readonly dsoDispatch: DsoDispatch;
    }
  | undefined;

function dsoComparator([, nameA]: DsoTuple, [, nameB]: DsoTuple) {
  if (nameA < nameB) {
    return -1;
  }
  if (nameB > nameA) {
    return 1;
  }
  return 0;
}

const DsoContext = createContext<DsoContextType>(undefined);

function dsoReducer(dsoState: DsoState, action: DsoAction): DsoState {
  const prevDsos = dsoState.dsos;

  switch (action.type) {
    case "addDso": {
      const [newDsoAddress, newDsoName] = action.payload;
      const dsosRemovedOld = prevDsos.filter(([address]) => address !== newDsoAddress);
      const newDsoTuple: DsoTuple = [newDsoAddress, newDsoName];
      const newDsos = [...dsosRemovedOld, newDsoTuple];
      const sortedDsos = newDsos.sort(dsoComparator);

      return { ...dsoState, dsos: sortedDsos };
    }
    case "removeDso": {
      const addressToRemove = action.payload;
      const dsosRemoved = prevDsos.filter(([address]) => address !== addressToRemove);
      const sortedDsos = dsosRemoved.sort(dsoComparator);

      return { ...dsoState, dsos: sortedDsos };
    }
    case "setAddDsoModal": {
      return { ...dsoState, addDsoModalState: action.payload };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function addDso(dispatch: DsoDispatch, dso: DsoTuple): void {
  dispatch({ type: "addDso", payload: dso });
}
export function removeDso(dispatch: DsoDispatch, dsoAddress: string): void {
  dispatch({ type: "removeDso", payload: dsoAddress });
}
export function openAddDsoModal(dispatch: DsoDispatch): void {
  dispatch({ type: "setAddDsoModal", payload: "open" });
}
export function closeAddDsoModal(dispatch: DsoDispatch): void {
  dispatch({ type: "setAddDsoModal", payload: "closed" });
}

export const useDso = (): NonNullable<DsoContextType> => {
  const context = useContext(DsoContext);

  if (context === undefined) {
    throw new Error("useDso must be used within a DsoProvider");
  }

  return context;
};

export default function DsoProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const [storedDsos, setStoredDsos] = useLocalStorage<readonly DsoTuple[]>(
    "stored-dsos",
    [],
    JSON.stringify,
    JSON.parse,
  );
  const [dsoState, dsoDispatch] = useReducer(dsoReducer, { dsos: storedDsos, addDsoModalState: "closed" });

  useEffect(() => {
    setStoredDsos(dsoState.dsos);
  }, [dsoState.dsos, setStoredDsos]);

  return (
    <DsoContext.Provider value={{ dsoState, dsoDispatch }}>
      <>
        {children}
        <AddDsoModal />
      </>
    </DsoContext.Provider>
  );
}
