import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { QueryClientImpl } from "codec/confio/poe/v1beta1/query";
import { createContext, HTMLAttributes, useContext, useEffect } from "react";
import { useSdk } from "service";
import { useApAddress, useApProposalsAddress } from "utils/storage";

type ApContextType =
  | {
      readonly apAddress: string | undefined;
      readonly apProposalsAddress: string | undefined;
    }
  | undefined;

const ApContext = createContext<ApContextType>(undefined);

export const useAp = (): NonNullable<ApContextType> => {
  const context = useContext(ApContext);

  if (context === undefined) {
    throw new Error("useAp must be used within a ApProvider");
  }

  return context;
};

export default function ApProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const {
    sdkState: { config },
  } = useSdk();

  const [localApAddress, setLocalApAddress] = useApAddress();
  const [localApProposalsAddress, setLocalApProposalsAddress] = useApProposalsAddress();
  const apContext: ApContextType = { apAddress: localApAddress, apProposalsAddress: localApProposalsAddress };

  useEffect(() => {
    (async function loadApAddressFromChain() {
      const tendermintClient = await Tendermint34Client.connect(config.rpcUrl);
      const queryClient = new QueryClient(tendermintClient);
      const rpcClient = createProtobufRpcClient(queryClient);
      const queryService = new QueryClientImpl(rpcClient);

      const { address: apAddress } = await queryService.ContractAddress({
        contractType: PoEContractType.ARBITER_POOL,
      });
      const { address: apProposalsAddress } = await queryService.ContractAddress({
        contractType: PoEContractType.ARBITER_POOL_VOTING,
      });

      setLocalApAddress(apAddress);
      setLocalApProposalsAddress(apProposalsAddress);
    })();
  }, [config.rpcUrl, setLocalApAddress, setLocalApProposalsAddress]);

  return <ApContext.Provider value={apContext}>{children}</ApContext.Provider>;
}
