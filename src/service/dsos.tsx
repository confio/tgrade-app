import { AddDsoModal, LeaveDsoModal } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { createContext, HTMLAttributes, useContext, useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSdk } from "service";
import { DsoContractQuerier } from "utils/dso";
import { useLocalStorage } from "utils/storage";

interface DsoId {
  readonly address: string;
  readonly name: string;
}

type DsoAddressesByUserMap = Map<string, readonly string[]>;

type ModalState = "open" | "closed";

type DsoAction =
  | {
      readonly type: "addDso";
      readonly payload: string;
    }
  | {
      readonly type: "removeDso";
      readonly payload: string;
    }
  | {
      readonly type: "setDsoAddresses";
      readonly payload: readonly string[];
    }
  | {
      readonly type: "setDsoIds";
      readonly payload: readonly DsoId[];
    }
  | {
      readonly type: "setAddDsoModal";
      readonly payload: ModalState;
    }
  | {
      readonly type: "setLeaveDsoModal";
      readonly payload: ModalState;
    };

type DsoDispatch = (action: DsoAction) => void;
type DsoState = {
  readonly dsoAddresses: readonly string[];
  readonly dsos: readonly DsoId[];
  readonly addDsoModalState: ModalState;
  readonly leaveDsoModalState: ModalState;
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
  switch (action.type) {
    case "addDso": {
      return { ...dsoState, dsoAddresses: [...new Set([...dsoState.dsoAddresses, action.payload])] };
    }
    case "removeDso": {
      const addressesRemoved = dsoState.dsoAddresses.filter((address) => address !== action.payload);
      return { ...dsoState, dsoAddresses: addressesRemoved };
    }
    case "setDsoAddresses": {
      return { ...dsoState, dsoAddresses: action.payload };
    }
    case "setDsoIds": {
      return { ...dsoState, dsos: action.payload };
    }
    case "setAddDsoModal": {
      return { ...dsoState, addDsoModalState: action.payload };
    }
    case "setLeaveDsoModal": {
      return { ...dsoState, leaveDsoModalState: action.payload };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function getDsoName(dsos: readonly DsoId[], dsoAddress: string): string {
  const dso = dsos.find(({ address }) => address === dsoAddress);
  return dso?.name ?? "Trusted Circle";
}
export function addDso(dispatch: DsoDispatch, dsoAddress: string): void {
  dispatch({ type: "addDso", payload: dsoAddress });
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
export function openLeaveDsoModal(dispatch: DsoDispatch): void {
  dispatch({ type: "setLeaveDsoModal", payload: "open" });
}
export function closeLeaveDsoModal(dispatch: DsoDispatch): void {
  dispatch({ type: "setLeaveDsoModal", payload: "closed" });
}

export const useDso = (): NonNullable<DsoContextType> => {
  const context = useContext(DsoContext);

  if (context === undefined) {
    throw new Error("useDso must be used within a DsoProvider");
  }

  return context;
};

const guestKey = "guest";

export default function DsoProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const history = useHistory();
  const {
    sdkState: { client, address },
  } = useSdk();
  const [currentAddress, setCurrentAddress] = useState(address);

  const [storedAddresses, setStoredAddresses] = useLocalStorage<DsoAddressesByUserMap>(
    "trusted-circles-addresses",
    new Map(),
    (map) => JSON.stringify(Array.from(map.entries())),
    (map) => new Map(JSON.parse(map)),
  );

  const [dsoState, dsoDispatch] = useReducer(dsoReducer, {
    dsoAddresses: storedAddresses.get(currentAddress || guestKey) ?? [],
    dsos: [],
    addDsoModalState: "closed",
    leaveDsoModalState: "closed",
  });

  /*
  if the address has changed, load its stored dsos
  if dsoAddresses has changed but not the address, store those dsoAddresses
  */
  useEffect(() => {
    if (address !== currentAddress) {
      const dsoAddresses = storedAddresses.get(address || guestKey) ?? [];
      dsoDispatch({ type: "setDsoAddresses", payload: dsoAddresses });
      setCurrentAddress(address);

      history.push(`${paths.dso.prefix}/${dsoAddresses[0]}`);
    } else {
      setStoredAddresses((prevAddresses) => prevAddresses.set(address || guestKey, dsoState.dsoAddresses));
    }
  }, [address, currentAddress, dsoState.dsoAddresses, history, setStoredAddresses, storedAddresses]);

  /*
  query dsoState.dsoAddresses to get the dso name
  with address & name, update dsos: DsoId[]
  remove address from storedAddresses if its query failed
  */
  useEffect(() => {
    if (!client) return;

    const dsoPromises: Promise<DsoId>[] = dsoState.dsoAddresses.map((dsoAddress) => {
      const dsoContract = new DsoContractQuerier(dsoAddress, client);
      return dsoContract.getDso().then(({ name }) => ({ address: dsoAddress, name }));
    });

    Promise.allSettled(dsoPromises).then((results) => {
      const rejectedResults = results.filter((result) => result.status === "rejected");
      const fulfilledResults = results.filter(
        (result): result is PromiseFulfilledResult<DsoId> => result.status === "fulfilled",
      );

      if (rejectedResults.length) {
        const dsoAddresses = fulfilledResults.map((result) => result.value.address);
        dsoDispatch({ type: "setDsoAddresses", payload: dsoAddresses });
      } else {
        const dsos = fulfilledResults.map((result) => result.value);
        dsoDispatch({ type: "setDsoIds", payload: dsos.sort(dsoComparator) });
      }
    });
  }, [client, dsoState.dsoAddresses]);

  return (
    <DsoContext.Provider value={{ dsoState, dsoDispatch }}>
      <>
        {children}

        <AddDsoModal />
        <LeaveDsoModal />
      </>
    </DsoContext.Provider>
  );
}
