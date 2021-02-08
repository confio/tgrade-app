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
  readonly getBalance: () => Promise<readonly Coin[]>;
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
  const { handleError } = useError();

  const [config, setConfig] = useState(configProp);
  const [signer, setSigner] = useState<OfflineSigner>();
  const [client, setClient] = useState<SigningCosmWasmClient>();
  const [address, setAddress] = useState<string>();

  // Get balance for each coin specified in config.coinMap
  const getBalance = useCallback(
    async function (): Promise<readonly Coin[]> {
      if (!client || !address) return [];

      const balance: Coin[] = [];
      try {
        for (const denom in config.coinMap) {
          const coin = await client.getBalance(address, denom);
          if (coin) {
            balance.push(coin);
          }
        }
        return balance;
      } catch (error) {
        handleError(error);
        return balance;
      }
    },
    [address, client, config.coinMap, handleError],
  );

  useEffect(() => {
    setValue((prevValue) => ({ ...prevValue, getBalance }));
  }, [getBalance]);

  // Get feeToken balance from faucet
  const hitFaucet = useCallback(
    async function (): Promise<void> {
      if (!config.faucetUrl || !config.feeToken || !address) return;

      try {
        const faucet = new FaucetClient(config.faucetUrl);
        await faucet.credit(address, config.feeToken);
      } catch (error) {
        handleError(error);
      }
    },
    [address, config.faucetUrl, config.feeToken, handleError],
  );

  useEffect(() => {
    setValue((prevValue) => ({ ...prevValue, hitFaucet }));
  }, [hitFaucet]);

  const readyContext = useMemo<CosmWasmContextType>(
    () => ({
      ...defaultContext,
      init: setSigner,
      clear: () => setSigner(undefined),
      getConfig: () => config,
      changeConfig: setConfig,
      changeSigner: setSigner,
    }),
    [config],
  );
  const [value, setValue] = useState<CosmWasmContextType>(readyContext);

  useEffect(() => {
    if (signer) return;

    setConfig(configProp);
    setClient(undefined);
    setAddress(undefined);
    setValue(readyContext);
  }, [configProp, readyContext, signer]);

  useEffect(() => {
    if (!config) return;

    (async function updateConfigAndStakingClient(): Promise<void> {
      try {
        const stakingClient = await createStakingClient(config.rpcUrl);
        setValue((prevValue) => ({
          ...prevValue,
          getConfig: () => config,
          getStakingClient: () => stakingClient,
        }));
      } catch (error) {
        handleError(error);
      }
    })();
  }, [config, handleError]);

  useEffect(() => {
    if (!signer) return;

    (async function updateSignerAndClient(): Promise<void> {
      try {
        const client = await createClient(config, signer);
        setClient(client);
        setValue((prevValue) => ({ ...prevValue, getSigner: () => signer, getClient: () => client }));
      } catch (error) {
        handleError(error);
      }
    })();
  }, [config, handleError, signer]);

  useEffect(() => {
    if (!signer) return;

    (async function updateAddress(): Promise<void> {
      try {
        const address = (await signer.getAccounts())[0].address;
        setAddress(address);
        setValue((prevValue) => ({ ...prevValue, getAddress: () => address }));
      } catch (error) {
        handleError(error);
      }
    })();
  }, [handleError, signer]);

  useEffect(() => {
    if (!config || !client || !address) return;

    (async function updateInitialized(): Promise<void> {
      const balance = await getBalance();
      if (!balance.find((coin) => coin.denom === config.feeToken)) {
        await hitFaucet();
      }

      setValue((prevValue) => ({
        ...prevValue,
        initialized: true,
        init: () => {},
      }));
    })();
  }, [address, client, config, getBalance, hitFaucet]);

  return <CosmWasmContext.Provider value={value}>{children}</CosmWasmContext.Provider>;
}
