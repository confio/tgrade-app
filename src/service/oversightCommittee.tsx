import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import LeaveOcModal from "App/components/LeaveOcModal";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { QueryClientImpl } from "codec/confio/poe/v1beta1/query";
import { createContext, HTMLAttributes, useContext, useEffect, useReducer } from "react";
import { useSdk } from "service";
import { useOcAddress } from "utils/storage";

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
  const {
    sdkState: { config },
  } = useSdk();

  const [localOcAddress, setLocalOcAddress] = useLocalStorage<string | undefined>("oversight-committee", "");
  const [ocState, ocDispatch] = useReducer(ocReducer, {
    ocAddress: localOcAddress,
    leaveOcModalState: "closed",
  });

  useEffect(() => {
    (async function loadOcAddressFromChain() {
      const tendermintClient = await Tendermint34Client.connect(config.rpcUrl);
      const queryClient = new QueryClient(tendermintClient);
      const rpcClient = createProtobufRpcClient(queryClient);
      const queryService = new QueryClientImpl(rpcClient);
      const { address: ocAddress } = await queryService.ContractAddress({
        contractType: PoEContractType.OVERSIGHT_COMMITTEE,
      });

      setLocalOcAddress(ocAddress);
    })();
  }, [config.rpcUrl, setLocalOcAddress]);

  return (
    <OcContext.Provider value={{ ocState, ocDispatch }}>
      <>
        {children}
        <LeaveOcModal />
      </>
    </OcContext.Provider>
  );
}
