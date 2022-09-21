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
import { AssetInfos, Factory } from "utils/factory";
import { useLocalStorage } from "utils/storage";
import { Pair, PairContract, TokenHuman } from "utils/tokens";

import { useError } from "./error";
import { useSdk } from "./sdk";

interface PaginationState {
  readonly cw20PaginationKey?: Uint8Array | undefined;
  readonly trustedTokenPaginationKey?: Uint8Array | undefined;
}

type PinnedTokensByUserMap = Map<string, readonly string[]>;

type TokensState = {
  readonly pinnedTokens: readonly string[];
  readonly tokens: Map<string, TokenHuman>;
  readonly canLoadNextTokens: boolean;
  readonly pairs: Map<string, Pair>;
  readonly selectedTokenFrom?: string | undefined;
  readonly selectedTokenTo?: string | undefined;
  readonly pinToken?: (tokenAddress: string) => void;
  readonly unpinToken?: (tokenAddress: string) => void;
  readonly pinUnpinToken?: (tokenAddress: string) => void;
  readonly loadToken?: (tokenAddress: string) => Promise<void>;
  readonly reloadTokens?: () => Promise<void>;
  readonly reloadPinnedTokensOnly?: () => Promise<void>;
  readonly loadNextTokens?: () => Promise<void>;
  readonly loadPair?: (pairAddressOrAssetInfos: string | AssetInfos) => Promise<void>;
  readonly reloadPairs?: () => Promise<void>;
};

type TokensAction =
  | {
      readonly type: "setPinnedTokens";
      readonly payload: readonly string[];
    }
  | {
      readonly type: "setTokens";
      readonly payload: Map<string, TokenHuman>;
    }
  | {
      readonly type: "setToken";
      readonly payload: TokenHuman;
    }
  | {
      readonly type: "setCanLoadNextTokens";
      readonly payload: boolean;
    }
  | {
      readonly type: "setPairs";
      readonly payload: Map<string, Pair>;
    }
  | {
      readonly type: "setPair";
      readonly payload: Pair;
    }
  | {
      readonly type: "setSelectedTokenFrom";
      readonly payload?: string | undefined;
    }
  | {
      readonly type: "setSelectedTokenTo";
      readonly payload?: string | undefined;
    }
  | {
      readonly type: "setPinToken";
      readonly payload: (tokenAddress: string) => void;
    }
  | {
      readonly type: "setUnpinToken";
      readonly payload: (tokenAddress: string) => void;
    }
  | {
      readonly type: "setPinUnpinToken";
      readonly payload: (tokenAddress: string) => void;
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
    }
  | {
      readonly type: "setLoadPair";
      readonly payload: (pairAddressOrAssetInfos: string | AssetInfos) => Promise<void>;
    }
  | {
      readonly type: "setReloadPairs";
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
    case "setPairs": {
      return { ...state, pairs: action.payload };
    }
    case "setPair": {
      const pairs = new Map(state.pairs);
      pairs.set(action.payload.contract_addr, action.payload);
      return { ...state, pairs };
    }
    case "setSelectedTokenFrom": {
      return { ...state, selectedTokenFrom: action.payload };
    }
    case "setSelectedTokenTo": {
      return { ...state, selectedTokenTo: action.payload };
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
    case "setLoadPair": {
      return { ...state, loadPair: action.payload };
    }
    case "setReloadPairs": {
      return { ...state, reloadPairs: action.payload };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function setSelectedTokenFrom(tokenAddress: string | undefined, dispatch: TokensDispatch): void {
  dispatch({ type: "setSelectedTokenFrom", payload: tokenAddress });
}

export function setSelectedTokenTo(tokenAddress: string | undefined, dispatch: TokensDispatch): void {
  dispatch({ type: "setSelectedTokenTo", payload: tokenAddress });
}

export function tokensMapToArray(tokens: Map<string, TokenHuman>, feeTokenDenom?: string): TokenHuman[] {
  function tokensComparator(a: TokenHuman, b: TokenHuman): -1 | 0 | 1 {
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

export function excludeLpTokens(tokens: TokenHuman[]): TokenHuman[] {
  return tokens.filter((token) => token.symbol !== "uLP" && token.name !== "tfi liquidity token");
}

export function includeOnlyLpTokens(tokens: TokenHuman[]): TokenHuman[] {
  return tokens.filter((token) => {
    return (
      (token.symbol === "uLP" && token.name === "tfi liquidity token") ||
      (token.symbol.startsWith("LP-") && token.name.includes("-"))
    );
  });
}

export function formatLpTokens(tokens: TokenHuman[], pairs: Pair[]): TokenHuman[] {
  const formattedTokens = tokens.map((token) => {
    // Check if token is Liquidity Token
    const pair = pairs.find((pair) => pair.liquidity_token === token.address);
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

export function filterTokensByText(tokens: TokenHuman[], searchText?: string | undefined): TokenHuman[] {
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
    sdkState: { config, codeIds, client, address },
  } = useSdk();

  const [loadedAddress, setLoadedAddress] = useState(address);
  const [paginationState, setPaginationState] = useState<PaginationState>({});
  const [storedPinnedTokens, setStoredPinnedTokens] = useLocalStorage<PinnedTokensByUserMap>(
    "pinned-tokens-map",
    new Map(),
    (map) => JSON.stringify(Array.from(map.entries())),
    (map) => new Map(JSON.parse(map)),
  );
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
    pinnedTokens: [],
    tokens: new Map(),
    canLoadNextTokens: false,
    pairs: new Map(),
  });

  const { pinnedTokens, tokens, pinToken, unpinToken, loadNextTokens, reloadPairs } = tokensState;

  // Load storedPinnedTokens into tokensState.pinnedTokens on app load
  useEffect(() => {
    (async function () {
      if (loadedAddress === address || !address) return;

      const myStoredPinnedTokens = storedPinnedTokens.get(address) ?? [];
      const cleanedPinnedTokens = cleanPinnedTokens(myStoredPinnedTokens);
      tokensDispatch({ type: "setPinnedTokens", payload: cleanedPinnedTokens });

      setLoadedAddress(address);
    })();
  }, [address, cleanPinnedTokens, loadedAddress, storedPinnedTokens]);

  // Serialize tokensState.pinnedTokens
  useEffect(() => {
    if (!loadedAddress || !address || loadedAddress !== address || pinnedTokensToRemove.length) return;

    const cleanedPinnedTokens = cleanPinnedTokens(pinnedTokens);
    setStoredPinnedTokens((prevMap) => prevMap.set(address, cleanedPinnedTokens));
  }, [
    address,
    cleanPinnedTokens,
    loadedAddress,
    pinnedTokens,
    pinnedTokensToRemove.length,
    setStoredPinnedTokens,
  ]);

  // Remove pinned tokens that were marked as to remove
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
          .filter((result): result is PromiseFulfilledResult<TokenHuman> => result.status === "fulfilled")
          .map((result) => result.value);

        const tokensToInit: Map<string, TokenHuman> = new Map();

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

  /*
    Load all pairs in the network
    NOTE: this might be removed if we ever get a way to query pair from liquidity token address.
          That way we'd only load the pairs for the loaded liquidity tokens, instead of all.
  */
  useEffect(() => {
    (async function () {
      if (!reloadPairs) return;

      try {
        await reloadPairs();
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [handleError, reloadPairs]);

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
    function pinToken(tokenAddress: string) {
      const newPinnedTokens = cleanPinnedTokens([...pinnedTokens, tokenAddress]);
      tokensDispatch({ type: "setPinnedTokens", payload: newPinnedTokens });
    }

    tokensDispatch({ type: "setPinToken", payload: pinToken });
  }, [cleanPinnedTokens, pinnedTokens]);

  // Set up tokensState.unpinToken
  useEffect(() => {
    function unpinToken(tokenAddress: string) {
      setPinnedTokensToRemove((prevTokensToRemove) => [...prevTokensToRemove, tokenAddress]);
    }

    tokensDispatch({ type: "setUnpinToken", payload: unpinToken });
  }, []);

  // Set up tokensState.pinUnpinToken
  useEffect(() => {
    if (!unpinToken || !pinToken) return;

    function pinUnpinToken(tokenAddress: string) {
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

      try {
        // Fill tokens map with TokenProps
        const tokenAddresses = tokensMapToArray(tokens).map((token) => token.address);

        const tokenPropsPromises = tokenAddresses.map((tokenAddress) =>
          Contract20WS.getTokenInfo(client, address, tokenAddress, config),
        );

        const tokenProps = (await Promise.allSettled(tokenPropsPromises))
          .filter((result): result is PromiseFulfilledResult<TokenHuman> => result.status === "fulfilled")
          .map((result) => result.value);

        const newTokens: Map<string, TokenHuman> = new Map();

        for (const tokenProp of tokenProps) {
          newTokens.set(tokenProp.address, tokenProp);
        }

        // Set new state
        tokensDispatch({ type: "setTokens", payload: newTokens });
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    }

    tokensDispatch({ type: "setReloadTokens", payload: reloadTokens });
  }, [address, client, config, handleError, tokens]);

  // Set up tokensState.reloadPinnedTokensOnly
  useEffect(() => {
    async function reloadPinnedTokensOnly() {
      if (!client || !address) return;

      try {
        // Fill tokens map with TokenProps
        const tokenPropsPromises = pinnedTokens.map((tokenAddress) =>
          Contract20WS.getTokenInfo(client, address, tokenAddress, config),
        );

        const tokenProps = (await Promise.allSettled(tokenPropsPromises))
          .filter((result): result is PromiseFulfilledResult<TokenHuman> => result.status === "fulfilled")
          .map((result) => result.value);

        const pinnedTokensMap: Map<string, TokenHuman> = new Map();

        for (const tokenProp of tokenProps) {
          pinnedTokensMap.set(tokenProp.address, tokenProp);
        }

        // Set new state
        tokensDispatch({ type: "setTokens", payload: new Map([...tokens, ...pinnedTokensMap]) });
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    }

    tokensDispatch({ type: "setReloadPinnedTokensOnly", payload: reloadPinnedTokensOnly });
  }, [address, client, config, handleError, pinnedTokens, tokens]);

  // Set up tokensState.loadNextTokens
  useEffect(() => {
    async function loadNextTokens() {
      if (!client || !codeIds || !address) return;

      try {
        // Get next contract addresses
        const cw20Response = await Contract20WS.getContracts(
          codeIds.token,
          client,
          paginationState.cw20PaginationKey,
        );

        const trustedTokenResponse = await Contract20WS.getContracts(
          codeIds.trustedToken,
          client,
          paginationState.trustedTokenPaginationKey,
        );

        const newTokenAddresses = [...cw20Response.contracts, ...trustedTokenResponse.contracts];

        // Fill tokens map with TokenProps

        const tokenPropsPromises = newTokenAddresses.map((tokenAddress) =>
          Contract20WS.getTokenInfo(client, address, tokenAddress, config),
        );

        const tokenProps = (await Promise.allSettled(tokenPropsPromises))
          .filter((result): result is PromiseFulfilledResult<TokenHuman> => result.status === "fulfilled")
          .map((result) => result.value);

        const newTokens: Map<string, TokenHuman> = new Map();

        for (const tokenProp of tokenProps) {
          newTokens.set(tokenProp.address, tokenProp);
        }

        // Set new state

        tokensDispatch({ type: "setTokens", payload: new Map([...tokens, ...newTokens]) });
        setPaginationState({
          cw20PaginationKey: cw20Response.pagination?.nextKey,
          trustedTokenPaginationKey: trustedTokenResponse.pagination?.nextKey,
        });
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    }

    tokensDispatch({ type: "setLoadNextTokens", payload: loadNextTokens });
  }, [
    address,
    client,
    codeIds,
    config,
    handleError,
    paginationState.cw20PaginationKey,
    paginationState.trustedTokenPaginationKey,
    tokens,
  ]);

  // Set up tokensState.loadPair
  useEffect(() => {
    async function loadPair(pairAddressOrAssetInfos: string | AssetInfos) {
      if (!client) return;

      try {
        const queryPair =
          typeof pairAddressOrAssetInfos === "string"
            ? () => PairContract.queryPair(client, pairAddressOrAssetInfos)
            : () => Factory.getPair(client, config.factoryAddress, pairAddressOrAssetInfos);

        const pair = await queryPair();
        if (!pair) return;
        tokensDispatch({ type: "setPair", payload: pair });
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    }

    tokensDispatch({ type: "setLoadPair", payload: loadPair });
  }, [client, config.factoryAddress, handleError]);

  // Set up tokensState.reloadPairs
  useEffect(() => {
    async function reloadPairs() {
      if (!client) return;

      try {
        const pairs = await Factory.getPairs(client, config.factoryAddress);
        const pairsMap = new Map<string, Pair>();

        for (const pairKey in pairs) {
          pairsMap.set(pairs[pairKey].contract_addr, pairs[pairKey]);
        }

        tokensDispatch({ type: "setPairs", payload: pairsMap });
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    }

    tokensDispatch({ type: "setReloadPairs", payload: reloadPairs });
  }, [client, config.factoryAddress, handleError]);

  return <TokensContext.Provider value={{ tokensState, tokensDispatch }}>{children}</TokensContext.Provider>;
}
