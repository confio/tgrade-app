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
  // readonly initialLoadDone: boolean;
  readonly cw20PaginationKey?: Uint8Array | undefined;
  readonly trustedTokenPaginationKey?: Uint8Array | undefined;
}

type TokensState = {
  readonly tokens: Map<string, TokenProps>;
  readonly pinToken: (tokenAddress: string) => void;
  readonly unpinToken: (tokenAddress: string) => void;
  readonly loadNextTokens: () => Promise<void>;
};

type TokensAction = {
  readonly type: "setToken";
  readonly payload: TokenProps;
};

type TokensDispatch = (action: TokensAction) => void;

function tokensReducer(state: TokensState, action: TokensAction): TokensState {
  switch (action.type) {
    case "setToken": {
      const tokens = new Map(state.tokens);
      tokens.set(action.payload.address, action.payload);
      return { ...state, tokens };
    }
    default: {
      throw new Error("Unhandled action type");
    }
  }
}

export function setToken(dispatch: TokensDispatch, token: TokenProps): void {
  dispatch({ type: "setToken", payload: token });
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

  const [pinnedTokens, setPinnedTokens] = usePinnedTokens();
  const [tokens, setTokens] = useState<Map<string, TokenProps>>(new Map());
  const [paginationState, setPaginationState] = useState<PaginationState>({});

  useEffect(() => {
    (async function () {
      if (!client || !address) return;

      const allTokenAddressesToInit = [config.feeToken, ...pinnedTokens];

      // If pinnedTokens changes, let's filter them out to break an infinite useEffect loop
      const tokenAddressesToInit = allTokenAddressesToInit.filter((token) => !tokens.has(token));
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
        setTokens((tokens) => new Map([...tokens, ...tokensToInit]));
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, client, config, handleError, pinnedTokens, tokens]);

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

  const loadNextTokens = useCallback(async () => {
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

    setTokens((tokens) => new Map([...tokens, ...newTokens]));
    setPaginationState({
      cw20PaginationKey: paginationState.cw20PaginationKey,
      trustedTokenPaginationKey: paginationState.trustedTokenPaginationKey,
    });
  }, [address, client, config, paginationState.cw20PaginationKey, paginationState.trustedTokenPaginationKey]);

  const [tokensState, tokensDispatch] = useReducer(tokensReducer, {
    tokens,
    pinToken,
    unpinToken,
    loadNextTokens,
  });

  return <TokensContext.Provider value={{ tokensState, tokensDispatch }}>{children}</TokensContext.Provider>;
}
