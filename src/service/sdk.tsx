import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { FaucetClient } from "@cosmjs/faucet-client";
import { Coin, OfflineSigner } from "@cosmjs/launchpad";
import { DistributionExtension, isBroadcastTxFailure, QueryClient, StakingExtension } from "@cosmjs/stargate";
import { NetworkConfig } from "config/network";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createQueryClient, createSigningClient } from "utils/sdk";
import {
  EncodeMsgDelegate,
  EncodeMsgUndelegate,
  EncodeMsgWithdrawDelegatorReward,
  getDelegationFee,
} from "utils/staking";
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
  readonly getQueryClient: () => QueryClient & StakingExtension & DistributionExtension;
  readonly getSigningClient: () => SigningCosmWasmClient;
  readonly delegateTokens: (validatorAddress: string, delegateAmount: Coin) => Promise<void>;
  readonly undelegateTokens: (validatorAddress: string, undelegateAmount: Coin) => Promise<void>;
  readonly withdrawRewards: (validatorAddress: string) => Promise<void>;
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
  getSigningClient: throwNotInitialized,
  getQueryClient: throwNotInitialized,
  delegateTokens: throwNotInitialized,
  undelegateTokens: throwNotInitialized,
  withdrawRewards: throwNotInitialized,
};

function isContextInitialized(context: CosmWasmContextType): boolean {
  return !Object.values(context).some((field) => field === throwNotInitialized);
}

const CosmWasmContext = React.createContext<CosmWasmContextType>(defaultContext);

export const useSdk = (): CosmWasmContextType => React.useContext(CosmWasmContext);

interface SdkProviderProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  readonly config: NetworkConfig;
}

export default function SdkProvider({ config: configProp, children }: SdkProviderProps): JSX.Element {
  const { handleError } = useError();

  const [config, setConfig] = useState(configProp);
  const [signer, setSigner] = useState<OfflineSigner>();
  const [signingClient, setSigningClient] = useState<SigningCosmWasmClient>();
  const [address, setAddress] = useState<string>();

  // Get balance for each coin specified in config.coinMap
  const getBalance = useCallback(
    async function (): Promise<readonly Coin[]> {
      if (!signingClient || !address) return [];

      const balance: Coin[] = [];
      try {
        for (const denom in config.coinMap) {
          const coin = await signingClient.getBalance(address, denom);
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
    [address, config.coinMap, handleError, signingClient],
  );

  useEffect(() => {
    setValue((prevValue) => ({ ...prevValue, getBalance }));
  }, [getBalance]);

  // Get feeToken balance from faucet
  const hitFaucet = useCallback(
    async function (): Promise<void> {
      if (!config.faucetUrl || !config.feeToken || !address) return;
      const tokens = config.faucetTokens || [config.feeToken];

      try {
        for (const token of tokens) {
          const faucet = new FaucetClient(config.faucetUrl);
          await faucet.credit(address, token);
        }
      } catch (error) {
        handleError(error);
      }
    },
    [address, config.faucetTokens, config.faucetUrl, config.feeToken, handleError],
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
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (signer) return;

    setConfig(configProp);
    setSigningClient(undefined);
    setAddress(undefined);
    setValue(readyContext);
  }, [configProp, readyContext, signer]);

  useEffect(() => {
    if (!config) return;

    (async function updateConfigAndQueryClient(): Promise<void> {
      try {
        const queryClient = await createQueryClient(config.rpcUrl);
        setValue((prevValue) => ({
          ...prevValue,
          getConfig: () => config,
          getQueryClient: () => queryClient,
        }));
      } catch (error) {
        handleError(error);
      }
    })();
  }, [config, handleError]);

  const delegateTokens = useCallback(
    async function (validatorAddress: string, delegateAmount: Coin): Promise<void> {
      if (!address || !signingClient) return;

      const delegatorAddress = address;
      const delegateMsg: EncodeMsgDelegate = {
        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
        value: { delegatorAddress, validatorAddress, amount: delegateAmount },
      };

      const response = await signingClient.signAndBroadcast(
        delegatorAddress,
        [delegateMsg],
        getDelegationFee(config),
      );
      if (isBroadcastTxFailure(response)) {
        throw new Error("Delegate failed");
      }
    },
    [address, config, signingClient],
  );

  useEffect(() => {
    setValue((prevValue) => ({ ...prevValue, delegateTokens }));
  }, [delegateTokens]);

  const undelegateTokens = useCallback(
    async function (validatorAddress: string, undelegateAmount: Coin): Promise<void> {
      if (!address || !signingClient) return;

      const delegatorAddress = address;
      const undelegateMsg: EncodeMsgUndelegate = {
        typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
        value: { delegatorAddress, validatorAddress, amount: undelegateAmount },
      };

      const response = await signingClient.signAndBroadcast(
        delegatorAddress,
        [undelegateMsg],
        getDelegationFee(config),
      );
      if (isBroadcastTxFailure(response)) {
        throw new Error("Undelegate failed");
      }
    },
    [address, config, signingClient],
  );

  useEffect(() => {
    setValue((prevValue) => ({ ...prevValue, undelegateTokens }));
  }, [undelegateTokens]);

  const withdrawRewards = useCallback(
    async function (validatorAddress: string): Promise<void> {
      if (!address || !signingClient) return;

      const delegatorAddress = address;
      const withdrawRewardsMsg: EncodeMsgWithdrawDelegatorReward = {
        typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
        value: { delegatorAddress, validatorAddress },
      };

      const response = await signingClient.signAndBroadcast(
        delegatorAddress,
        [withdrawRewardsMsg],
        getDelegationFee(config),
      );
      if (isBroadcastTxFailure(response)) {
        throw new Error("Rewards withdrawal failed");
      }
    },
    [address, config, signingClient],
  );

  useEffect(() => {
    setValue((prevValue) => ({ ...prevValue, withdrawRewards }));
  }, [withdrawRewards]);

  useEffect(() => {
    if (!signer) return;

    (async function updateSignerAndSigningClient(): Promise<void> {
      try {
        const client = await createSigningClient(config, signer);
        setSigningClient(client);
        setValue((prevValue) => ({ ...prevValue, getSigner: () => signer, getSigningClient: () => client }));
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

  useEffect(() => setInitialized(isContextInitialized(value)), [value]);

  useEffect(() => {
    if (!initialized) return;

    (async function hitFaucetAndInitialize(): Promise<void> {
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
  }, [config.feeToken, getBalance, hitFaucet, initialized]);

  return <CosmWasmContext.Provider value={value}>{children}</CosmWasmContext.Provider>;
}
