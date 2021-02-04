import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { FaucetClient } from "@cosmjs/faucet-client";
import { Coin, OfflineSigner } from "@cosmjs/launchpad";
import { DistributionExtension, QueryClient, StakingExtension } from "@cosmjs/stargate";
import { NetworkConfig } from "config/network";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, createStakingClient } from "utils/sdk";
import { useError } from "./error";

interface CosmWasmContextType {
  readonly initialized: boolean;
  readonly init: (signer: OfflineSigner) => void;
  readonly clear: () => void;
  readonly getConfig: () => NetworkConfig;
  readonly changeConfig: (config: NetworkConfig) => void;
  readonly getAddress: () => string;
  readonly getBalance: () => readonly Coin[];
  readonly refreshBalance: () => Promise<void>;
  readonly hitFaucet: () => Promise<void>;
  readonly getSigner: () => OfflineSigner;
  readonly changeSigner: (newSigner: OfflineSigner) => void;
  readonly getClient: () => SigningCosmWasmClient;
  readonly getStakingClient: () => QueryClient & StakingExtension & DistributionExtension;
}

function throwNotInitialized(): any {
  throw new Error("Not yet initialized");
}

const defaultContext: CosmWasmContextType = {
  initialized: false,
  init: throwNotInitialized,
  clear: throwNotInitialized,
  getConfig: throwNotInitialized,
  changeConfig: throwNotInitialized,
  getAddress: throwNotInitialized,
  getBalance: throwNotInitialized,
  refreshBalance: throwNotInitialized,
  hitFaucet: throwNotInitialized,
  getSigner: throwNotInitialized,
  changeSigner: throwNotInitialized,
  getClient: throwNotInitialized,
  getStakingClient: throwNotInitialized,
};

const CosmWasmContext = React.createContext<CosmWasmContextType>(defaultContext);

export const useSdk = (): CosmWasmContextType => React.useContext(CosmWasmContext);

interface SdkProviderProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  readonly config: NetworkConfig;
}

export default function SdkProvider({ config: configProp, children }: SdkProviderProps): JSX.Element {
  const { setError } = useError();

  const [config, setConfig] = useState(configProp);
  const [signer, setSigner] = useState<OfflineSigner>();
  const [client, setClient] = useState<SigningCosmWasmClient>();

  const readyContext = useMemo<CosmWasmContextType>(
    () => ({ ...defaultContext, init: setSigner, getConfig: () => config }),
    [config],
  );
  const [value, setValue] = useState<CosmWasmContextType>(readyContext);

  function clear() {
    setSigner(undefined);
  }

  useEffect(() => {
    if (signer) return;

    setConfig(configProp);
    setClient(undefined);
    setValue(readyContext);
  }, [configProp, readyContext, signer]);

  // Get balance for each coin specified in config.coinMap
  const refreshBalance = useCallback(
    async function (address: string, balance: Coin[]): Promise<void> {
      if (!client) return;

      balance.length = 0;
      for (const denom in config.coinMap) {
        const coin = await client.getBalance(address, denom);
        if (coin) balance.push(coin);
      }
    },
    [client, config.coinMap],
  );

  // Get feeToken balance from faucet
  const hitFaucet = useCallback(
    async function (address: string): Promise<void> {
      if (!config.faucetUrl || !config.feeToken) return;

      try {
        const faucet = new FaucetClient(config.faucetUrl);
        await faucet.credit(address, config.feeToken);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    },
    [config.faucetUrl, config.feeToken, setError],
  );

  useEffect(() => {
    if (!signer) return;

    (async function updateClient(): Promise<void> {
      try {
        const client = await createClient(config, signer);
        setClient(client);
      } catch (error) {
        setError(error.message);
      }
    })();
  }, [config, setError, signer]);

  useEffect(() => {
    if (!signer || !client) return;

    const balance: Coin[] = [];

    (async function updateValue(): Promise<void> {
      const address = (await signer.getAccounts())[0].address;

      await refreshBalance(address, balance);
      if (!balance.find((coin) => coin.denom === config.feeToken)) {
        await hitFaucet(address);
      }
      await refreshBalance(address, balance);

      const stakingClient = await createStakingClient(config.rpcUrl);

      setValue({
        initialized: true,
        init: () => {},
        clear,
        getConfig: () => config,
        changeConfig: setConfig,
        getAddress: () => address,
        getBalance: () => balance,
        refreshBalance: refreshBalance.bind(null, address, balance),
        hitFaucet: hitFaucet.bind(null, address),
        getSigner: () => signer,
        changeSigner: setSigner,
        getClient: () => client,
        getStakingClient: () => stakingClient,
      });
    })();
  }, [client, config, hitFaucet, refreshBalance, signer]);

  return <CosmWasmContext.Provider value={value}>{children}</CosmWasmContext.Provider>;
}
