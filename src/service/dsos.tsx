import { AddDsoModal } from "App/components/logic";
import * as React from "react";
import { createContext, HTMLAttributes, useContext, useEffect, useReducer } from "react";
import { useSdk } from "service";
import { useLocalStorage } from "utils/storage";

interface DsoId {
  readonly address: string;
  readonly name: string;
}

type DsosByUserMap = Map<string, readonly DsoId[]>;

type ModalState = "open" | "closed";

type DsoAction =
  | {
      readonly type: "addDso";
      readonly payload: DsoId;
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
  readonly dsos: readonly DsoId[];
  readonly addDsoModalState: ModalState;
};

type DsoContextType =
  | {
      readonly dsoState: DsoState;
      readonly dsoDispatch: DsoDispatch;
    }
  | undefined;

function dsoComparator({ name: nameA }: DsoId, { name: nameB }: DsoId) {
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
      const newDso = action.payload;
      const dsosRemovedOld = prevDsos.filter(({ address }) => address !== newDso.address);
      const newDsos = [...dsosRemovedOld, newDso];
      const sortedDsos = newDsos.sort(dsoComparator);

      return { ...dsoState, dsos: sortedDsos };
    }
    case "removeDso": {
      const addressToRemove = action.payload;
      const dsosRemoved = prevDsos.filter(({ address }) => address !== addressToRemove);
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

export function getDsoName(dsos: readonly DsoId[], dsoAddress: string): string {
  const dso = dsos.find(({ address }) => address === dsoAddress);
  return dso?.name ?? "DSO";
}
export function addDso(dispatch: DsoDispatch, dso: DsoId): void {
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
  const {
    sdkState: { address },
  } = useSdk();

  const [storedDsos, setStoredDsos] = useLocalStorage<DsosByUserMap>(
    "trusted-circles",
    new Map(),
    (map) => JSON.stringify(Array.from(map.entries())),
    (map) => new Map(JSON.parse(map)),
  );
  const dsos = storedDsos.get(address) ?? [];
  const [dsoState, dsoDispatch] = useReducer(dsoReducer, { dsos, addDsoModalState: "closed" });

  useEffect(() => {
    setStoredDsos((prevStoredDsos) => prevStoredDsos.set(address, dsoState.dsos));
  }, [address, dsoState.dsos, setStoredDsos]);

  return (
    <DsoContext.Provider value={{ dsoState, dsoDispatch }}>
      <>
        {children}
        <AddDsoModal />
      </>
    </DsoContext.Provider>
  );
}
