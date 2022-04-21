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
import { PairProps, TokenProps } from "utils/tokens";

import { useError } from "./error";
import { useSdk } from "./sdk";

interface PaginationState {
  readonly cw20PaginationKey?: Uint8Array | undefined;
  readonly trustedTokenPaginationKey?: Uint8Array | undefined;
}

type TokensState = {
  readonly pinnedTokens: readonly string[];
  readonly tokens: Map<string, TokenProps>;
  readonly canLoadNextTokens: boolean;
  readonly pinToken?: (tokenAddress: string) => void;
  readonly unpinToken?: (tokenAddress: string) => void;
  readonly pinUnpinToken?: (tokenAddress: string) => void;
  readonly loadToken?: (tokenAddress: string) => Promise<void>;
  readonly reloadTokens?: () => Promise<void>;
  readonly reloadPinnedTokensOnly?: () => Promise<void>;
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
      readonly type: "setCanLoadNextTokens";
      readonly payload: boolean;
    }
  | {
      readonly type: "setPinToken";
      readonly payload: (tokenAddress: string) => Promise<void>;
    }
  | {
      readonly type: "setUnpinToken";
      readonly payload: (tokenAddress: string) => Promise<void>;
    }
  | {
      readonly type: "setPinUnpinToken";
      readonly payload: (tokenAddress: string) => Promise<void>;
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
      const tokens = new Map(state.tokens);
      tokens.set(action.payload.address, action.payload);
      return { ...state, tokens };
    }
    case "setCanLoadNextTokens": {
      return { ...state, canLoadNextTokens: action.payload };
    }
    case "setPinToken": {
      return { ...state, pinToken: action.payload };
    }
    case "setUnpinToken": {
      return { ...state, unpinToken: action.payload };
    }
    case "setPinUnpinToken": {
      return { ...state, pinUnpinToken: action.payload };
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
    case "setLoadNextTokens": {
      return { ...state, loadNextTokens: action.payload };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function tokensMapToArray(tokens: Map<string, TokenProps>, feeTokenDenom?: string): TokenProps[] {
  function tokensComparator(a: TokenProps, b: TokenProps): -1 | 0 | 1 {
    if (feeTokenDenom && feeTokenDenom === a.address) return -1;
    if (feeTokenDenom && feeTokenDenom === b.address) return 1;

    if (a.symbol < b.symbol) return -1;
    if (a.symbol > b.symbol) return 1;

    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;

    return 0;
  }

  return Array.from(tokens.values()).sort(tokensComparator);
}

export function excludeLpTokens(tokens: TokenProps[]): TokenProps[] {
  return tokens.filter((token) => token.symbol !== "uLP" && token.name !== "tfi liquidity token");
}

export function includeOnlyLpTokens(tokens: TokenProps[]): TokenProps[] {
  return tokens.filter((token) => {
    return (
      (token.symbol === "uLP" && token.name === "tfi liquidity token") ||
      (token.symbol.startsWith("LP-") && token.name.includes("-"))
    );
  });
}

export function formatLpTokens(tokens: TokenProps[], pairsObj: { [key: string]: PairProps }): TokenProps[] {
  const formattedTokens = tokens.map((token) => {
    // Check if token is Liquidity Token
    const pair = Object.values(pairsObj).find((pair) => pair.liquidity_token === token.address);
    if (!pair) return token;

    const tokenAddressA = pair.asset_infos[0].native || pair.asset_infos[0].token;
    const tokenAddressB = pair.asset_infos[1].native || pair.asset_infos[1].token;
    const tokenA = tokens.find((token) => token.address === tokenAddressA);
    const tokenB = tokens.find((token) => token.address === tokenAddressB);

    if (!tokenA || !tokenB) return token;

    return {
      ...token,
      symbol: `LP-${tokenA.symbol}-${tokenB.symbol}`,
      name: `${tokenA.symbol}(${tokenA.address})-${tokenB.symbol}(${tokenB.address})`,
    };
  });

  return formattedTokens;
}

export function filterTokensByText(tokens: TokenProps[], searchText?: string | undefined): TokenProps[] {
  if (!searchText) return tokens;

  return tokens.filter(
    (token) =>
      token.symbol.toLowerCase().search(searchText.toLowerCase()) !== -1 ||
      token.name.toLowerCase().search(searchText.toLowerCase()) !== -1 ||
      token.address.toLowerCase().search(searchText.toLowerCase()) !== -1,
  );
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
  const [storedPinnedTokens, setStoredPinnedTokens] = usePinnedTokens();
  const [pinnedTokensToRemove, setPinnedTokensToRemove] = useState<readonly string[]>([]);

  // Inserts feeToken (utgd) and removes duplicates
  const cleanPinnedTokens = useCallback(
    (tokens: readonly string[]) => {
      const withFeeToken = [config.feeToken, ...tokens];
      const withoutDuplicates = [...new Set(withFeeToken)];
      return withoutDuplicates;
    },
    [config.feeToken],
  );

  const [tokensState, tokensDispatch] = useReducer(tokensReducer, {
    pinnedTokens: cleanPinnedTokens(storedPinnedTokens),
    tokens: new Map(),
    canLoadNextTokens: false,
  });

  const { pinnedTokens, tokens, pinToken, unpinToken, loadNextTokens } = tokensState;

  // Wire localStorage's storedPinnedTokens to tokensState.pinnedTokens
  useEffect(() => {
    if (pinnedTokensToRemove.length) return;

    const cleanedPinnedTokens = cleanPinnedTokens(pinnedTokens);
    const isEveryPinnedTokenStored = cleanedPinnedTokens.every((token) => storedPinnedTokens.includes(token));
    const isEveryStoredTokenPinned = storedPinnedTokens.every((token) => cleanedPinnedTokens.includes(token));

    if (!isEveryPinnedTokenStored || !isEveryStoredTokenPinned) {
      setStoredPinnedTokens(cleanedPinnedTokens);
    }
  }, [
    cleanPinnedTokens,
    pinnedTokens,
    pinnedTokensToRemove.length,
    setStoredPinnedTokens,
    storedPinnedTokens,
  ]);

  useEffect(() => {
    if (!pinnedTokensToRemove.length) return;

    const newPinnedTokens = cleanPinnedTokens([
      ...pinnedTokens.filter((token) => !pinnedTokensToRemove.includes(token)),
    ]);

    setPinnedTokensToRemove([]);
    tokensDispatch({ type: "setPinnedTokens", payload: newPinnedTokens });
  }, [cleanPinnedTokens, pinnedTokens, pinnedTokensToRemove]);

  // Load pinnedTokens not already present in tokensState.tokens
  useEffect(() => {
    (async function () {
      if (!client || !address) return;

      // If pinnedTokens changes, let's filter them out to break an infinite useEffect loop
      const tokenAddressesToInit = pinnedTokens.filter((token) => !tokens.has(token));
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

        // Remove failed responses from pinnedTokens (when token address did not find token_info)

        const pinnedTokensToRemove = pinnedTokens.filter(
          (pinnedToken) => !tokensToInit.has(pinnedToken) && !tokens.has(pinnedToken),
        );
        setPinnedTokensToRemove(pinnedTokensToRemove);

        // Set new state
        tokensDispatch({ type: "setTokens", payload: new Map([...tokens, ...tokensToInit]) });
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, client, config, handleError, pinnedTokens, tokens]);

  // Set up tokensState.canLoadNextTokens
  useEffect(() => {
    const isLoadNextTokensReady = !!loadNextTokens;
    // A valid key is undefined (first request), or an array with length.
    // An empty array means the last request was already made
    const hasSomePaginationKey =
      paginationState.cw20PaginationKey === undefined ||
      paginationState.cw20PaginationKey.length ||
      paginationState.trustedTokenPaginationKey === undefined ||
      paginationState.trustedTokenPaginationKey.length;

    if (isLoadNextTokensReady && hasSomePaginationKey) {
      tokensDispatch({ type: "setCanLoadNextTokens", payload: true });
    } else {
      tokensDispatch({ type: "setCanLoadNextTokens", payload: false });
    }
  }, [loadNextTokens, paginationState.cw20PaginationKey, paginationState.trustedTokenPaginationKey]);

  // Set up tokensState.pinToken
  useEffect(() => {
    async function pinToken(tokenAddress: string) {
      const newPinnedTokens = cleanPinnedTokens([...pinnedTokens, tokenAddress]);
      tokensDispatch({ type: "setPinnedTokens", payload: newPinnedTokens });
    }

    tokensDispatch({ type: "setPinToken", payload: pinToken });
  }, [cleanPinnedTokens, pinnedTokens]);

  // Set up tokensState.unpinToken
  useEffect(() => {
    async function unpinToken(tokenAddress: string) {
      setPinnedTokensToRemove((prevTokensToRemove) => [...prevTokensToRemove, tokenAddress]);
    }

    tokensDispatch({ type: "setUnpinToken", payload: unpinToken });
  }, []);

  // Set up tokensState.pinUnpinToken
  useEffect(() => {
    if (!unpinToken || !pinToken) return;

    async function pinUnpinToken(tokenAddress: string) {
      if (!unpinToken || !pinToken) return;

      if (pinnedTokens.includes(tokenAddress)) {
        unpinToken(tokenAddress);
      } else {
        pinToken(tokenAddress);
      }
    }

    tokensDispatch({ type: "setPinUnpinToken", payload: pinUnpinToken });
  }, [pinToken, pinnedTokens, unpinToken]);

  // Set up tokensState.loadToken
  useEffect(() => {
    async function loadToken(tokenAddress: string) {
      if (!client || !address) return;

      try {
        const tokenProps = await Contract20WS.getTokenInfo(client, address, tokenAddress, config);
        tokensDispatch({ type: "setToken", payload: tokenProps });
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    }

    tokensDispatch({ type: "setLoadToken", payload: loadToken });
  }, [address, client, config, handleError]);

  // Set up tokensState.reloadTokens
  useEffect(() => {
    async function reloadTokens() {
      if (!client || !address) return;

      // Fill tokens map with TokenProps
      const tokenAddresses = tokensMapToArray(tokens).map((token) => token.address);

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
  }, [address, client, config, tokens]);

  // Set up tokensState.reloadPinnedTokensOnly
  useEffect(() => {
    async function reloadPinnedTokensOnly() {
      if (!client || !address) return;

      // Fill tokens map with TokenProps

      const tokenPropsPromises = pinnedTokens.map((tokenAddress) =>
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
      tokensDispatch({ type: "setTokens", payload: new Map([...tokens, ...pinnedTokensMap]) });
    }

    tokensDispatch({ type: "setReloadPinnedTokensOnly", payload: reloadPinnedTokensOnly });
  }, [address, client, config, pinnedTokens, tokens]);

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

      tokensDispatch({ type: "setTokens", payload: new Map([...tokens, ...newTokens]) });
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
    tokens,
  ]);

  return <TokensContext.Provider value={{ tokensState, tokensDispatch }}>{children}</TokensContext.Provider>;
}
