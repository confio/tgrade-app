import {
  createContext,
  HTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Contract20WS } from "utils/cw20";
import { usePinnedTokens } from "utils/storage";
import { TokenProps } from "utils/tokens";

import { useError } from "./error";
import { useSdk } from "./sdk";

interface PaginationState {
  readonly cw20PaginationKey?: Uint8Array | undefined;
  readonly trustedTokenPaginationKey?: Uint8Array | undefined;
}

type TokensState = {
  readonly pinnedTokens: readonly string[];
  readonly pinToken: (tokenAddress: string) => void;
  readonly unpinToken: (tokenAddress: string) => void;
  readonly tokens: Map<string, TokenProps>;
  readonly loadToken?: (tokenAddress: string) => Promise<void>;
  readonly reloadTokens?: () => Promise<void>;
  readonly reloadPinnedTokensOnly?: () => Promise<void>;
  readonly canLoadNextTokens: boolean;
  readonly loadNextTokens?: () => Promise<void>;
};

type TokensAction =
  | {
      readonly type: "setPinnedTokens";
      readonly payload: readonly string[];
    }
  | {
      readonly type: "setTokens";
      readonly payload: Map<string, TokenProps>;
    }
  | {
      readonly type: "setToken";
      readonly payload: TokenProps;
    }
  | {
      readonly type: "setLoadToken";
      readonly payload: (tokenAddress: string) => Promise<void>;
    }
  | {
      readonly type: "setReloadTokens";
      readonly payload: () => Promise<void>;
    }
  | {
      readonly type: "setReloadPinnedTokensOnly";
      readonly payload: () => Promise<void>;
    }
  | {
      readonly type: "setCanLoadNextTokens";
      readonly payload: boolean;
    }
  | {
      readonly type: "setLoadNextTokens";
      readonly payload: () => Promise<void>;
    };

type TokensDispatch = (action: TokensAction) => void;

function tokensReducer(state: TokensState, action: TokensAction): TokensState {
  switch (action.type) {
    case "setPinnedTokens": {
      return { ...state, pinnedTokens: action.payload };
    }
    case "setTokens": {
      return { ...state, tokens: action.payload };
    }
    case "setToken": {
      state.tokens.set(action.payload.address, action.payload);
      return { ...state };
    }
    case "setLoadToken": {
      return { ...state, loadToken: action.payload };
    }
    case "setReloadTokens": {
      return { ...state, reloadTokens: action.payload };
    }
    case "setReloadPinnedTokensOnly": {
      return { ...state, reloadPinnedTokensOnly: action.payload };
    }
    case "setCanLoadNextTokens": {
      return { ...state, canLoadNextTokens: action.payload };
    }
    case "setLoadNextTokens": {
      return { ...state, loadNextTokens: action.payload };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function tokensMapToArray(tokens: Map<string, TokenProps>): readonly TokenProps[] {
  return Array.from(tokens.values());
}

type TokensContextType = {
  readonly tokensState: TokensState;
  readonly tokensDispatch: TokensDispatch;
};

const TokensContext = createContext<TokensContextType | undefined>(undefined);

export const useTokens = (): TokensContextType => {
  const tokensContext = useContext(TokensContext);

  if (tokensContext === undefined) {
    throw new Error("useTokens must be used within a TokensProvider");
  }

  return tokensContext;
};

export default function TokensProvider({ children }: HTMLAttributes<HTMLElement>): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client, address },
  } = useSdk();

  const [paginationState, setPaginationState] = useState<PaginationState>({});
  const [pinnedTokens, setPinnedTokens] = usePinnedTokens();

  // Inserts feeToken (utgd) and removes duplicates
  const cleanPinnedTokens = useCallback(
    (tokens: readonly string[]) => {
      const withFeeToken = [config.feeToken, ...tokens];
      const withoutDuplicates = [...new Set(withFeeToken)];
      return withoutDuplicates;
    },
    [config.feeToken],
  );

  const pinToken = useCallback(
    (tokenToPin: string) => {
      setPinnedTokens((tokens) => (tokens.includes(tokenToPin) ? tokens : [...tokens, tokenToPin]));
    },
    [setPinnedTokens],
  );

  const unpinToken = useCallback(
    (tokenToUnpin: string) => {
      setPinnedTokens((tokens) => tokens.filter((token) => token !== tokenToUnpin));
    },
    [setPinnedTokens],
  );

  const [tokensState, tokensDispatch] = useReducer(tokensReducer, {
    pinnedTokens: cleanPinnedTokens(pinnedTokens),
    pinToken,
    unpinToken,
    tokens: new Map(),
    canLoadNextTokens: false,
  });

  // Wire localStorage's pinnedTokens to tokensState.pinnedTokens
  useEffect(() => {
    tokensDispatch({
      type: "setPinnedTokens",
      payload: cleanPinnedTokens(pinnedTokens),
    });
  }, [cleanPinnedTokens, pinnedTokens]);

  // Load pinnedTokens not already present in tokensState.tokens
  useEffect(() => {
    (async function () {
      if (!client || !address) return;

      // If pinnedTokens changes, let's filter them out to break an infinite useEffect loop
      const tokenAddressesToInit = tokensState.pinnedTokens.filter((token) => !tokensState.tokens.has(token));
      if (!tokenAddressesToInit.length) return;

      try {
        const tokenPropsPromises = tokenAddressesToInit.map((tokenAddress) =>
          Contract20WS.getTokenInfo(client, address, tokenAddress, config),
        );

        // Fill tokens map with TokenProps

        const tokenProps = (await Promise.allSettled(tokenPropsPromises))
          .filter((result): result is PromiseFulfilledResult<TokenProps> => result.status === "fulfilled")
          .map((result) => result.value);

        const tokensToInit: Map<string, TokenProps> = new Map();

        for (const tokenProp of tokenProps) {
          tokensToInit.set(tokenProp.address, tokenProp);
        }

        // Set new state
        tokensDispatch({ type: "setTokens", payload: new Map([...tokensState.tokens, ...tokensToInit]) });
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, client, config, handleError, tokensState.pinnedTokens, tokensState.tokens]);

  // Set up tokensState.loadToken
  useEffect(() => {
    async function loadToken(tokenAddress: string) {
      if (!client || !address) return;

      const tokenProps = await Contract20WS.getTokenInfo(client, address, tokenAddress, config);
      tokensDispatch({ type: "setToken", payload: tokenProps });
    }

    tokensDispatch({ type: "setLoadToken", payload: loadToken });
  }, [address, client, config]);

  // Set up tokensState.reloadTokens
  useEffect(() => {
    async function reloadTokens() {
      if (!client || !address) return;

      // Fill tokens map with TokenProps
      const tokenAddresses = tokensMapToArray(tokensState.tokens).map((token) => token.address);

      const tokenPropsPromises = tokenAddresses.map((tokenAddress) =>
        Contract20WS.getTokenInfo(client, address, tokenAddress, config),
      );

      const tokenProps = (await Promise.allSettled(tokenPropsPromises))
        .filter((result): result is PromiseFulfilledResult<TokenProps> => result.status === "fulfilled")
        .map((result) => result.value);

      const newTokens: Map<string, TokenProps> = new Map();

      for (const tokenProp of tokenProps) {
        newTokens.set(tokenProp.address, tokenProp);
      }

      // Set new state
      tokensDispatch({ type: "setTokens", payload: newTokens });
    }

    tokensDispatch({ type: "setReloadTokens", payload: reloadTokens });
  }, [address, client, config, tokensState.tokens]);

  // Set up tokensState.reloadPinnedTokensOnly
  useEffect(() => {
    async function reloadPinnedTokensOnly() {
      if (!client || !address) return;

      // Fill tokens map with TokenProps

      const tokenPropsPromises = tokensState.pinnedTokens.map((tokenAddress) =>
        Contract20WS.getTokenInfo(client, address, tokenAddress, config),
      );

      const tokenProps = (await Promise.allSettled(tokenPropsPromises))
        .filter((result): result is PromiseFulfilledResult<TokenProps> => result.status === "fulfilled")
        .map((result) => result.value);

      const pinnedTokensMap: Map<string, TokenProps> = new Map();

      for (const tokenProp of tokenProps) {
        pinnedTokensMap.set(tokenProp.address, tokenProp);
      }

      // Set new state
      tokensDispatch({ type: "setTokens", payload: new Map([...tokensState.tokens, ...pinnedTokensMap]) });
    }

    tokensDispatch({ type: "setReloadPinnedTokensOnly", payload: reloadPinnedTokensOnly });
  }, [address, client, config, tokensState.pinnedTokens, tokensState.tokens]);

  // Set up tokensState.canLoadNextTokens
  useEffect(() => {
    const isLoadNextTokensReady = !!tokensState.loadNextTokens;
    const hasSomePaginationKey =
      (paginationState.cw20PaginationKey && paginationState.cw20PaginationKey.length) ||
      (paginationState.trustedTokenPaginationKey && paginationState.trustedTokenPaginationKey.length);

    if (isLoadNextTokensReady && hasSomePaginationKey) {
      tokensDispatch({ type: "setCanLoadNextTokens", payload: true });
    } else {
      tokensDispatch({ type: "setCanLoadNextTokens", payload: false });
    }
  }, [
    paginationState.cw20PaginationKey,
    paginationState.trustedTokenPaginationKey,
    tokensState.loadNextTokens,
  ]);

  // Set up tokensState.loadNextTokens
  useEffect(() => {
    async function loadNextTokens() {
      if (!client || !address) return;

      // Get next contract addresses

      const cw20Response = await Contract20WS.getContracts(
        config.codeIds?.cw20Tokens?.[0] ?? 0,
        client,
        paginationState.cw20PaginationKey,
      );

      const trustedTokenResponse = await Contract20WS.getContracts(
        config.codeIds?.tgradeCw20?.[0] ?? 0,
        client,
        paginationState.trustedTokenPaginationKey,
      );

      const newTokenAddresses = [...cw20Response.contracts, ...trustedTokenResponse.contracts];

      // Fill tokens map with TokenProps

      const tokenPropsPromises = newTokenAddresses.map((tokenAddress) =>
        Contract20WS.getTokenInfo(client, address, tokenAddress, config),
      );

      const tokenProps = (await Promise.allSettled(tokenPropsPromises))
        .filter((result): result is PromiseFulfilledResult<TokenProps> => result.status === "fulfilled")
        .map((result) => result.value);

      const newTokens: Map<string, TokenProps> = new Map();

      for (const tokenProp of tokenProps) {
        newTokens.set(tokenProp.address, tokenProp);
      }

      // Set new state

      tokensDispatch({ type: "setTokens", payload: new Map([...tokensState.tokens, ...newTokens]) });
      setPaginationState({
        cw20PaginationKey: cw20Response.pagination?.nextKey,
        trustedTokenPaginationKey: trustedTokenResponse.pagination?.nextKey,
      });
    }

    tokensDispatch({ type: "setLoadNextTokens", payload: loadNextTokens });
  }, [
    address,
    client,
    config,
    paginationState.cw20PaginationKey,
    paginationState.trustedTokenPaginationKey,
    tokensState.tokens,
  ]);

  return <TokensContext.Provider value={{ tokensState, tokensDispatch }}>{children}</TokensContext.Provider>;
}
