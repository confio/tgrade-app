import { UserError } from "App/pages/TMarket/utils";
import * as React from "react";
import { createContext, HTMLAttributes, useContext, useReducer } from "react";
import { useSdk } from "service";
import { Contract20WS } from "utils/cw20";
import { Factory } from "utils/factory";
import { LPToken, PairProps, PoolProps, TokenProps } from "utils/tokens";

export type FormErrors = {
  from: UserError | undefined;
  to: UserError | undefined;
};

type tMarketAction =
  | {
      readonly type: "setTokens";
      readonly payload: { [key: string]: TokenProps };
    }
  | {
      readonly type: "setFactoryAddress";
      readonly payload: string;
    }
  | {
      readonly type: "setPairs";
      readonly payload: { [key: string]: PairProps };
    }
  | {
      readonly type: "setPool";
      readonly payload: PoolProps | undefined;
    }
  | {
      readonly type: "updateToken";
      readonly payload: { [key: string]: TokenProps };
    }
  | {
      readonly type: "updateLPToken";
      readonly payload: { [key: string]: LPToken };
    }
  | {
      readonly type: "setEstimatingFromA";
      readonly payload: boolean;
    }
  | {
      readonly type: "setEstimatingFromB";
      readonly payload: boolean;
    }
  | {
      readonly type: "setLPTokens";
      readonly payload: { [key: string]: { token: TokenProps; pair: PairProps } };
    }
  | {
      readonly type: "setSearchText";
      readonly payload: string | undefined;
    };

type tMarketDispatch = (action: tMarketAction) => void;
type tMarketState = {
  readonly tokens: { [key: string]: TokenProps };
  readonly factoryAddress: string;
  readonly pairs: { [key: string]: PairProps };
  readonly lpTokens: { [key: string]: { token: TokenProps; pair: PairProps } };
  readonly pool: PoolProps | undefined;
  readonly searchText: string | undefined;
  readonly estimatingFromA: boolean;
  readonly estimatingFromB: boolean;
};

type tMarketContextType =
  | {
      readonly tMarketDispatch: tMarketDispatch;
      readonly tMarketState: tMarketState;
    }
  | undefined;

const tMarketContext = createContext<tMarketContextType>(undefined);

function tMarketReducer(tMarketState: tMarketState, action: tMarketAction): tMarketState {
  switch (action.type) {
    case "setTokens": {
      return { ...tMarketState, tokens: action.payload };
    }
    case "setLPTokens": {
      return { ...tMarketState, lpTokens: action.payload };
    }
    case "updateToken": {
      return { ...tMarketState, tokens: { ...tMarketState.tokens, ...action.payload } };
    }
    case "updateLPToken": {
      return {
        ...tMarketState,
        lpTokens: {
          ...tMarketState.lpTokens,
          ...action.payload,
        },
      };
    }
    case "setFactoryAddress": {
      return { ...tMarketState, factoryAddress: action.payload };
    }
    case "setSearchText": {
      return { ...tMarketState, searchText: action.payload };
    }
    case "setPairs": {
      return { ...tMarketState, pairs: action.payload };
    }
    case "setPool": {
      return { ...tMarketState, pool: action.payload };
    }
    case "setEstimatingFromA": {
      return { ...tMarketState, estimatingFromA: action.payload };
    }
    case "setEstimatingFromB": {
      return { ...tMarketState, estimatingFromB: action.payload };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function setPool(dispatch: tMarketDispatch, pool: PoolProps): void {
  dispatch({ type: "setPool", payload: pool });
}
export function updateToken(dispatch: tMarketDispatch, token: { [key: string]: TokenProps }): void {
  dispatch({ type: "updateToken", payload: token });
}
export function setLPTokens(
  dispatch: tMarketDispatch,
  token: { [key: string]: { token: TokenProps; pair: PairProps } },
): void {
  dispatch({ type: "setLPTokens", payload: token });
}
export function updateLPToken(dispatch: tMarketDispatch, token: { [key: string]: LPToken }): void {
  dispatch({ type: "updateLPToken", payload: token });
}
export function updatePairs(dispatch: tMarketDispatch, pairs: { [key: string]: PairProps }): void {
  dispatch({ type: "setPairs", payload: pairs });
}
export function setSearchText(dispatch: tMarketDispatch, text: string | undefined): void {
  dispatch({ type: "setSearchText", payload: text });
}
export function setEstimatingFromA(dispatch: tMarketDispatch): void {
  dispatch({ type: "setEstimatingFromA", payload: true });
  dispatch({ type: "setEstimatingFromB", payload: false });
}
export function setEstimatingFromB(dispatch: tMarketDispatch): void {
  dispatch({ type: "setEstimatingFromB", payload: true });
  dispatch({ type: "setEstimatingFromA", payload: false });
}
export function setEstimatingSwitch(
  dispatch: tMarketDispatch,
  estimatingFromA: boolean,
  estimatingFromB: boolean,
): void {
  dispatch({ type: "setEstimatingFromB", payload: estimatingFromA });
  dispatch({ type: "setEstimatingFromA", payload: estimatingFromB });
}
export const useTMarket = (): NonNullable<tMarketContextType> => {
  const context = useContext(tMarketContext);

  if (context === undefined) {
    throw new Error("usetMarket must be used within a tMarketProvider");
  }

  return context;
};

export default function TMarketProvider({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const { sdkState } = useSdk();
  const { client, config, address, signingClient } = sdkState;

  const [tMarketState, tMarketDispatch] = useReducer(tMarketReducer, {
    tokens: {},
    lpTokens: {},
    searchText: undefined,
    estimatingFromB: false,
    estimatingFromA: false,
    factoryAddress: "",
    pairs: {},
    pool: undefined,
  });

  React.useEffect(() => {
    (async () => {
      if (client && address && signingClient) {
        //Gets all tokens
        const allTokens = await Contract20WS.getAll(config, client, address);
        tMarketDispatch({ type: "setTokens", payload: allTokens });
        //Gets Factory address
        // @ts-ignore: Object is possibly 'null'.
        const contracts = await client.getContracts(config.codeIds.tgradeFactory[0]);
        if (contracts.length > 0) {
          tMarketDispatch({ type: "setFactoryAddress", payload: contracts[contracts.length - 1] });
        } else {
          // Instance of Factory contract release v0.0.7
          const new_factory = await Factory.createFactory(
            signingClient,
            // @ts-ignore: Object is possibly 'null'.
            config.codeIds.tgradeFactory[0],
            address,
            // @ts-ignore: Object is possibly 'null'.
            config.codeIds.tgradePair[0],
            // @ts-ignore: Object is possibly 'null'.
            config.codeIds.tgradeCw20[0],
            config.gasPrice,
          );
          tMarketDispatch({ type: "setFactoryAddress", payload: new_factory });
          console.log("new_factory_address:", new_factory);
        }
      }
    })();
  }, [client, config, address, signingClient]);

  React.useEffect(() => {
    (async () => {
      //Gets all pairs
      if (client && tMarketState.factoryAddress) {
        const pairs = await Factory.getPairs(client, tMarketState.factoryAddress);
        tMarketDispatch({ type: "setPairs", payload: pairs });
      }
    })();
  }, [tMarketState.factoryAddress, client]);

  React.useEffect(() => {
    (async () => {
      if (!client || !address) return;
      const lp_tokens = await Contract20WS.getLPTokens(
        client,
        address,
        tMarketState.pairs,
        tMarketState.tokens,
        config,
      );
      tMarketDispatch({ type: "setLPTokens", payload: lp_tokens });
    })();
  }, [tMarketState.pairs, tMarketState.tokens, address, client, config]);
  return (
    <tMarketContext.Provider value={{ tMarketState, tMarketDispatch }}>{children}</tMarketContext.Provider>
  );
}
