import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { FaucetClient } from "@cosmjs/faucet-client";
import { LedgerSigner } from "@cosmjs/ledger-amino";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import { Coin } from "@cosmjs/stargate";
import { NetworkConfig } from "config/network";
import { createContext, useContext, useEffect, useReducer } from "react";
import { gtagConnectWallet, gtagSendWalletInfo } from "utils/analytics";
import {
  createClient,
  createSigningClient,
  getLastConnectedWallet,
  isKeplrAvailable,
  isKeplrSigner,
  isLedgerAvailable,
  isLedgerSigner,
  loadKeplrWallet,
  loadLedgerWallet,
  setLastConnectedWallet,
} from "utils/sdk";
import { retry } from "utils/ui";
import { useError } from "./error";

type SdkState = {
  readonly config: NetworkConfig;
  readonly client?: CosmWasmClient;
  readonly signer?: OfflineDirectSigner | LedgerSigner;
  readonly address?: string;
  readonly signingClient?: SigningCosmWasmClient;
  readonly getBalance?: (address?: string) => Promise<readonly Coin[]>;
  readonly hitFaucet?: () => Promise<void>;
};

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
      readonly type: "setClient";
      readonly payload: CosmWasmClient;
    }
  | {
      readonly type: "setSigner";
      readonly payload: OfflineDirectSigner | LedgerSigner;
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
    };

type SdkDispatch = (action: SdkAction) => void;

function sdkReducer(state: SdkState, action: SdkAction): SdkState {
  switch (action.type) {
    case "resetSdk": {
      return {
        config: action.payload ?? state.config,
        client: action.payload ? undefined : state.client,
        signer: undefined,
        address: undefined,
        signingClient: undefined,
        getBalance: undefined,
        hitFaucet: undefined,
      };
    }
    case "setConfig": {
      return { ...state, config: action.payload };
    }
    case "setClient": {
      return { ...state, client: action.payload };
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
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function isSdkInitialized(state: SdkState): state is Required<SdkState> {
  return !Object.values(state).some((field) => field === undefined);
}
export const resetSdk = (dispatch: SdkDispatch): void => dispatch({ type: "resetSdk" });
export function setSigner(dispatch: SdkDispatch, signer: OfflineDirectSigner | LedgerSigner): void {
  dispatch({ type: "setSigner", payload: signer });
}
export function setAddress(dispatch: SdkDispatch, address: string): void {
  dispatch({ type: "setAddress", payload: address });
}

export async function hitFaucetIfNeeded(state: SdkState): Promise<void> {
  const balance = (await state.getBalance?.()) ?? [];
  if (balance.find((coin) => coin.amount === "0")) {
    await state.hitFaucet?.();
  }
}

type SdkContextType = {
  readonly sdkState: SdkState;
  readonly sdkDispatch: SdkDispatch;
};

const SdkContext = createContext<SdkContextType | undefined>(undefined);

export const useSdk = (): SdkContextType => {
  const sdkContext = useContext(SdkContext);

  if (sdkContext === undefined) {
    throw new Error("useSdk must be used within a SdkProvider");
  }

  return sdkContext;
};

interface SdkProviderProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  readonly config: NetworkConfig;
}

export default function SdkProvider({ config, children }: SdkProviderProps): JSX.Element {
  const { handleError } = useError();
  const [sdkState, sdkDispatch] = useReducer(sdkReducer, {
    config,
    client: undefined,
    signer: undefined,
    address: undefined,
    signingClient: undefined,
    getBalance: undefined,
    hitFaucet: undefined,
  });

  useEffect(() => {
    let mounted = true;

    (async function setClient(): Promise<void> {
      try {
        const client = await createClient(sdkState.config.rpcUrl);
        if (mounted) sdkDispatch({ type: "setClient", payload: client });
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
        await gtagSendWalletInfo(address);

        if (isKeplrSigner(sdkState.signer)) {
          gtagConnectWallet("keplr", address);
        }

        if (isLedgerSigner(sdkState.signer)) {
          gtagConnectWallet("ledger", address);
        }

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

    (async function reconnectSigner(): Promise<void> {
      const lastConnectedWallet = getLastConnectedWallet();
      if (sdkState.signer || !lastConnectedWallet) return;

      try {
        if (lastConnectedWallet === "keplr") {
          await retry(isKeplrAvailable);
          const signer = await loadKeplrWallet(config);
          if (mounted) sdkDispatch({ type: "setSigner", payload: signer });
        }
        if (lastConnectedWallet === "ledger" && isLedgerAvailable()) {
          const signer = await loadLedgerWallet(config);
          if (mounted) sdkDispatch({ type: "setSigner", payload: signer });
        }
      } catch (error) {
        setLastConnectedWallet("");
        handleError(error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [config, handleError, sdkState.signer]);

  useEffect(() => {
    let mounted = true;

    (async function setSigningClient(): Promise<void> {
      if (!sdkState.signer) return;

      try {
        const signingClient = await createSigningClient(sdkState.config, sdkState.signer);
        if (mounted) sdkDispatch({ type: "setSigningClient", payload: signingClient });
      } catch (error) {
        handleError(error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [handleError, sdkState.config, sdkState.signer]);

  useEffect(() => {
    async function getBalance(address?: string): Promise<readonly Coin[]> {
      if (!sdkState.client || !sdkState.address) return [];

      const queryAddress = address || sdkState.address;
      const balance: Coin[] = [];

      try {
        for (const denom in sdkState.config.coinMap) {
          const coin = await sdkState.client.getBalance(queryAddress, denom);
          balance.push(coin);
        }
        return balance;
      } catch (error) {
        handleError(error);
        return balance;
      }
    }

    sdkDispatch({ type: "setGetBalance", payload: getBalance });
  }, [handleError, sdkState.address, sdkState.client, sdkState.config.coinMap]);

  useEffect(() => {
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

  return <SdkContext.Provider value={{ sdkState, sdkDispatch }}>{children}</SdkContext.Provider>;
}
