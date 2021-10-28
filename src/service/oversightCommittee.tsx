import LeaveOcModal from "App/components/LeaveOcModal";
import { createContext, HTMLAttributes, useContext, useEffect, useReducer } from "react";
import { useDso } from "service";
import { useLocalStorage } from "utils/storage";

type ModalState = "open" | "closed";

type OcAction = {
  readonly type: "setLeaveOcModal";
  readonly payload: ModalState;
};

type OcDispatch = (action: OcAction) => void;
type OcState = {
  readonly ocAddress: string | undefined;
  readonly leaveOcModalState: ModalState;
};

type OcContextType =
  | {
      readonly ocState: OcState;
      readonly ocDispatch: OcDispatch;
    }
  | undefined;

const OcContext = createContext<OcContextType>(undefined);

function ocReducer(dsoState: OcState, action: OcAction): OcState {
  switch (action.type) {
    case "setLeaveOcModal": {
      return { ...dsoState, leaveOcModalState: action.payload };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function openLeaveOcModal(dispatch: OcDispatch): void {
  dispatch({ type: "setLeaveOcModal", payload: "open" });
}
export function closeLeaveOcModal(dispatch: OcDispatch): void {
  dispatch({ type: "setLeaveOcModal", payload: "closed" });
}

export const useOc = (): NonNullable<OcContextType> => {
  const context = useContext(OcContext);

  if (context === undefined) {
    throw new Error("useOc must be used within a OcProvider");
  }

  return context;
};

export default function OcProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  /* 
  NOTE first dso address is used as OC address temporarily
  */
  const {
    dsoState: { dsoAddresses },
  } = useDso();
  /**/

  const [localOcAddress, setLocalOcAddress] = useLocalStorage<string | undefined>("oversight-committee", "");
  const [ocState, ocDispatch] = useReducer(ocReducer, {
    ocAddress: localOcAddress,
    leaveOcModalState: "closed",
  });

  useEffect(() => {
    // TODO get ocAddress from chain
    const ocAddress = dsoAddresses.length ? dsoAddresses[0] : "";
    setLocalOcAddress(ocAddress);
  }, [dsoAddresses, setLocalOcAddress]);

  return (
    <OcContext.Provider value={{ ocState, ocDispatch }}>
      <>
        {children}
        <LeaveOcModal />
      </>
    </OcContext.Provider>
  );
}
