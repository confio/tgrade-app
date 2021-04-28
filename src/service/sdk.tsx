import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { FaucetClient } from "@cosmjs/faucet-client";
import { Coin, OfflineSigner } from "@cosmjs/launchpad";
import {
  BankExtension,
  coinFromProto,
  DistributionExtension,
  isBroadcastTxFailure,
  QueryClient,
  StakingExtension,
} from "@cosmjs/stargate";
import { NetworkConfig } from "config/network";
import * as React from "react";
import { createContext, useContext, useEffect, useReducer } from "react";
import { createQueryClient, createSigningClient } from "utils/sdk";
import { getDelegationFee, MsgDelegate, MsgUndelegate, MsgWithdrawDelegatorReward } from "utils/staking";
import { useError } from "./error";

type ExtendedQueryClient = QueryClient & BankExtension & StakingExtension & DistributionExtension;

type SdkAction =
  | {
      readonly type: "resetSdk";
      readonly payload?: NetworkConfig;
    }
  | {
      readonly type: "setConfig";
      readonly payload: NetworkConfig;
    }
  | {
      readonly type: "setQueryClient";
      readonly payload: ExtendedQueryClient;
    }
  | {
      readonly type: "setSigner";
      readonly payload: OfflineSigner;
    }
  | {
      readonly type: "setAddress";
      readonly payload: string;
    }
  | {
      readonly type: "setSigningClient";
      readonly payload: SigningCosmWasmClient;
    }
  | {
      readonly type: "setGetBalance";
      readonly payload?: (address?: string) => Promise<readonly Coin[]>;
    }
  | {
      readonly type: "setHitFaucet";
      readonly payload?: () => Promise<void>;
    }
  | {
      readonly type: "setDelegateTokens";
      readonly payload?: (validatorAddress: string, delegateAmount: Coin) => Promise<void>;
    }
  | {
      readonly type: "setUndelegateTokens";
      readonly payload?: (validatorAddress: string, undelegateAmount: Coin) => Promise<void>;
    }
  | {
      readonly type: "setWithdrawRewards";
      readonly payload?: (validatorAddress: string) => Promise<void>;
    };

type SdkDispatch = (action: SdkAction) => void;

type SdkState = {
  readonly config: NetworkConfig;
  readonly queryClient?: ExtendedQueryClient;
  readonly signer?: OfflineSigner;
  readonly address?: string;
  readonly signingClient?: SigningCosmWasmClient;
  readonly getBalance?: (address?: string) => Promise<readonly Coin[]>;
  readonly hitFaucet?: () => Promise<void>;
  readonly delegateTokens?: (validatorAddress: string, delegateAmount: Coin) => Promise<void>;
  readonly undelegateTokens?: (validatorAddress: string, undelegateAmount: Coin) => Promise<void>;
  readonly withdrawRewards?: (validatorAddress: string) => Promise<void>;
};

function sdkReducer(state: SdkState, action: SdkAction): SdkState {
  switch (action.type) {
    case "resetSdk": {
      return {
        config: action.payload ?? state.config,
        queryClient: action.payload ? undefined : state.queryClient,
        signer: undefined,
        address: undefined,
        signingClient: undefined,
        getBalance: undefined,
        hitFaucet: undefined,
        delegateTokens: undefined,
        undelegateTokens: undefined,
        withdrawRewards: undefined,
      };
    }
    case "setConfig": {
      return { ...state, config: action.payload };
    }
    case "setQueryClient": {
      return { ...state, queryClient: action.payload };
    }
    case "setSigner": {
      return { ...state, signer: action.payload };
    }
    case "setAddress": {
      return { ...state, address: action.payload };
    }
    case "setSigningClient": {
      return { ...state, signingClient: action.payload };
    }
    case "setGetBalance": {
      return { ...state, getBalance: action.payload };
    }
    case "setHitFaucet": {
      return { ...state, hitFaucet: action.payload };
    }
    case "setDelegateTokens": {
      return { ...state, delegateTokens: action.payload };
    }
    case "setUndelegateTokens": {
      return { ...state, undelegateTokens: action.payload };
    }
    case "setWithdrawRewards": {
      return { ...state, withdrawRewards: action.payload };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function isSdkInitialized(state: SdkState): state is Required<SdkState> {
  return !Object.values(state).some((field) => field === undefined);
}

export function setSigner(dispatch: SdkDispatch, signer: OfflineSigner): void {
  dispatch({ type: "setSigner", payload: signer });
}
export const initSdk = setSigner;
export const resetSdk = (dispatch: SdkDispatch): void => dispatch({ type: "resetSdk" });

export async function hitFaucetIfNeeded(state: SdkState): Promise<void> {
  if (!isSdkInitialized(state)) return;

  const balance = await state.getBalance();
  if (!balance.find((coin) => coin.denom === state.config.feeToken && coin.amount !== "0")) {
    await state.hitFaucet();
  }
}

type SdkContextType =
  | {
      readonly sdkState: SdkState;
      readonly sdkDispatch: SdkDispatch;
    }
  | undefined;

type SdkContextInitType = Pick<NonNullable<SdkContextType>, "sdkDispatch"> & {
  readonly sdkState: Pick<SdkState, "config">;
};

const SdkContext = createContext<SdkContextType>(undefined);

export const useSdkInit = (): SdkContextInitType => {
  const context = useContext(SdkContext);

  if (context === undefined) {
    throw new Error("useSdkInit must be used within a SdkProvider");
  }

  return context;
};

type RequiredSdkContextType = {
  readonly sdkState: Required<SdkState>;
  readonly sdkDispatch: SdkDispatch;
};

export const useSdk = (): RequiredSdkContextType => {
  const sdkContext = useContext(SdkContext);

  if (sdkContext === undefined) {
    throw new Error("useSdk must be used within a SdkProvider");
  }

  const { sdkState, sdkDispatch } = sdkContext;
  if (!isSdkInitialized(sdkState)) {
    throw new Error("Sdk is not initialized, call useSdkInit instead");
  }

  return { sdkState, sdkDispatch };
};

interface SdkProviderProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  readonly config: NetworkConfig;
}

export default function SdkProvider({ config, children }: SdkProviderProps): JSX.Element {
  const { handleError } = useError();
  const [sdkState, sdkDispatch] = useReducer(sdkReducer, {
    config,
    queryClient: undefined,
    signer: undefined,
    address: undefined,
    signingClient: undefined,
    getBalance: undefined,
    hitFaucet: undefined,
    delegateTokens: undefined,
    undelegateTokens: undefined,
    withdrawRewards: undefined,
  });

  useEffect(() => {
    let mounted = true;

    (async function setQueryClient(): Promise<void> {
      try {
        const queryClient = await createQueryClient(sdkState.config.rpcUrl);
        if (mounted) sdkDispatch({ type: "setQueryClient", payload: queryClient });
      } catch (error) {
        handleError(error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [handleError, sdkState.config.rpcUrl]);

  useEffect(() => {
    let mounted = true;

    (async function setAddress(): Promise<void> {
      if (!sdkState.signer) return;

      try {
        const { address } = (await sdkState.signer.getAccounts())[0];
        if (mounted) sdkDispatch({ type: "setAddress", payload: address });
      } catch (error) {
        handleError(error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [handleError, sdkState.signer]);

  useEffect(() => {
    let mounted = true;

    (async function setSigningClient(): Promise<void> {
      if (!sdkState.signer) return;

      try {
        const client = await createSigningClient(sdkState.config, sdkState.signer);
        if (mounted) sdkDispatch({ type: "setSigningClient", payload: client });
      } catch (error) {
        handleError(error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [handleError, sdkState.config, sdkState.signer]);

  useEffect(() => {
    if (!sdkState.queryClient || !sdkState.address) {
      sdkDispatch({ type: "setGetBalance" });
      return;
    }

    async function getBalance(address?: string): Promise<readonly Coin[]> {
      if (!sdkState.queryClient || !sdkState.address) return [];

      const queryAddress = address ?? sdkState.address;
      const balance: Coin[] = [];
      try {
        for (const denom in sdkState.config.coinMap) {
          const res = await sdkState.queryClient.bank.unverified.balance(queryAddress, denom);
          const coin = res ? coinFromProto(res) : null;
          if (coin) {
            balance.push(coin);
          }
        }
        return balance;
      } catch (error) {
        handleError(error);
        return balance;
      }
    }

    sdkDispatch({ type: "setGetBalance", payload: getBalance });
  }, [handleError, sdkState.address, sdkState.config.coinMap, sdkState.queryClient]);

  useEffect(() => {
    if (!sdkState.address) {
      sdkDispatch({ type: "setHitFaucet" });
      return;
    }

    async function hitFaucet(): Promise<void> {
      if (!sdkState.address) return;

      const config = sdkState.config;
      const tokens = config.faucetTokens || [config.feeToken];

      try {
        for (const token of tokens) {
          const faucet = new FaucetClient(config.faucetUrl);
          await faucet.credit(sdkState.address, token);
        }
      } catch (error) {
        handleError(error);
      }
    }

    sdkDispatch({ type: "setHitFaucet", payload: hitFaucet });
  }, [handleError, sdkState.address, sdkState.config]);

  useEffect(() => {
    if (!sdkState.address || !sdkState.signingClient) {
      sdkDispatch({ type: "setDelegateTokens" });
      return;
    }

    async function delegateTokens(validatorAddress: string, delegateAmount: Coin): Promise<void> {
      if (!sdkState.address || !sdkState.signingClient) return;

      const delegatorAddress = sdkState.address;
      const delegateMsg = {
        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
        value: MsgDelegate.fromPartial({ delegatorAddress, validatorAddress, amount: delegateAmount }),
      };

      const response = await sdkState.signingClient.signAndBroadcast(
        delegatorAddress,
        [delegateMsg],
        getDelegationFee(sdkState.config),
      );
      if (isBroadcastTxFailure(response)) {
        throw new Error("Delegate failed");
      }
    }

    sdkDispatch({ type: "setDelegateTokens", payload: delegateTokens });
  }, [sdkState.address, sdkState.config, sdkState.signingClient]);

  useEffect(() => {
    if (!sdkState.address || !sdkState.signingClient) {
      sdkDispatch({ type: "setUndelegateTokens" });
      return;
    }

    async function undelegateTokens(validatorAddress: string, undelegateAmount: Coin): Promise<void> {
      if (!sdkState.address || !sdkState.signingClient) return;

      const delegatorAddress = sdkState.address;
      const undelegateMsg = {
        typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
        value: MsgUndelegate.fromPartial({ delegatorAddress, validatorAddress, amount: undelegateAmount }),
      };

      const response = await sdkState.signingClient.signAndBroadcast(
        delegatorAddress,
        [undelegateMsg],
        getDelegationFee(sdkState.config),
      );
      if (isBroadcastTxFailure(response)) {
        throw new Error("Undelegate failed");
      }
    }

    sdkDispatch({ type: "setUndelegateTokens", payload: undelegateTokens });
  }, [sdkState.address, sdkState.config, sdkState.signingClient]);

  useEffect(() => {
    if (!sdkState.address || !sdkState.signingClient) {
      sdkDispatch({ type: "setWithdrawRewards" });
      return;
    }

    async function withdrawRewards(validatorAddress: string): Promise<void> {
      if (!sdkState.address || !sdkState.signingClient) return;

      const delegatorAddress = sdkState.address;
      const withdrawRewardsMsg = {
        typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
        value: MsgWithdrawDelegatorReward.fromPartial({ delegatorAddress, validatorAddress }),
      };

      const response = await sdkState.signingClient.signAndBroadcast(
        delegatorAddress,
        [withdrawRewardsMsg],
        getDelegationFee(sdkState.config),
      );
      if (isBroadcastTxFailure(response)) {
        throw new Error("Rewards withdrawal failed");
      }
    }

    sdkDispatch({ type: "setWithdrawRewards", payload: withdrawRewards });
  }, [sdkState.address, sdkState.config, sdkState.signingClient]);

  return <SdkContext.Provider value={{ sdkState, sdkDispatch }}>{children}</SdkContext.Provider>;
}
