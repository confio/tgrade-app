import { Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { useTokens } from "service/tokens";
import { Contract20WS } from "utils/cw20";
import { Factory } from "utils/factory";
import { Pair, Pool, PoolContract, TokenHuman } from "utils/tokens";

import { TxResult } from "../ShowTxResult";
import { AuthorizePairForm } from "./components/AuthorizePairForm";
import { CreatePairForm } from "./components/CreatePairForm";
import { FundPairForm } from "./components/FundPairForm";
import { OperatePairForm } from "./components/OperatePairForm";
import ShowTxResultModal from "./components/ShowTxResultModal";

const { Text } = Typography;

export type Authorization = "unneeded" | "needed" | "done";

export interface TokenWithAuth extends TokenHuman {
  readonly approval?: Authorization;
}

export type TokenWhitelisting =
  | {
      readonly status: Omit<Authorization, "unneeded">;
      readonly tcAddress: string;
    }
  | { readonly status: "unneeded" };

export interface PairWhitelisting {
  readonly tokenA: TokenWhitelisting;
  readonly tokenB: TokenWhitelisting;
}

export interface PairWithAuth extends Pair {
  readonly whitelisting: PairWhitelisting;
}

type TMarketFormStep = "select" | "create" | "authorize" | "fund" | "swap" | "withdraw";

export function TMarketForm(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client, address },
  } = useSdk();

  const {
    tokensState: { selectedTokenFrom, selectedTokenTo, loadToken, loadPair: loadPairToProvider },
  } = useTokens();

  const [txResult, setTxResult] = useState<TxResult>();
  const [step, setStep] = useState<TMarketFormStep>();

  const [tokenFrom, setTokenFrom] = useState<TokenWithAuth>();
  const [tokenTo, setTokenTo] = useState<TokenWithAuth>();
  const [pair, setPair] = useState<PairWithAuth>();
  const [pool, setPool] = useState<Pool>();

  const isPoolEmpty = !pool || pool.total_share === "0";

  const getTokenWithAuth = useCallback(
    async (tokenAddress: string): Promise<TokenWithAuth | undefined> => {
      if (!client || !address || !loadToken) return;

      const tokenInfo = await Contract20WS.getTokenInfo(client, address, tokenAddress, config);
      await loadToken(tokenInfo.address);

      if (!pair) return tokenInfo;

      let approval: Authorization = "needed";

      if (tokenInfo.address === config.feeToken) {
        approval = "unneeded";
      } else {
        const isApproved = await Contract20WS.isApproved(client, tokenAddress, address, pair.contract_addr);

        approval = isApproved ? "done" : "needed";
      }

      const tokenFrom: TokenWithAuth = {
        ...tokenInfo,
        approval,
      };
      return tokenFrom;
    },
    [address, client, config, loadToken, pair],
  );

  useEffect(() => {
    (async function getTokenFrom() {
      if (!selectedTokenFrom) return;

      try {
        const tokenFrom = await getTokenWithAuth(selectedTokenFrom);
        setTokenFrom(tokenFrom);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [getTokenWithAuth, handleError, selectedTokenFrom]);

  useEffect(() => {
    (async function getTokenTo() {
      if (!selectedTokenTo) return;

      try {
        const tokenTo = await getTokenWithAuth(selectedTokenTo);
        setTokenTo(tokenTo);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [getTokenWithAuth, handleError, selectedTokenTo]);

  const getPairWithAuth = useCallback(async () => {
    if (!client || !tokenFrom || !tokenTo || !loadPairToProvider) return;

    // TODO: Do not query pair again if token places swapped

    try {
      const tokenObjA =
        tokenFrom.address === config.feeToken ? { native: tokenFrom.address } : { token: tokenFrom.address };
      const tokenObjB =
        tokenTo.address === config.feeToken ? { native: tokenTo.address } : { token: tokenTo.address };

      const pair = await Factory.getPair(client, config.factoryAddress, [tokenObjA, tokenObjB]);
      if (!pair) return;

      const tokenATcAddress = await Contract20WS.getTcAddress(client, tokenObjA.token);
      let tokenAWhitelisting: TokenWhitelisting = { status: "unneeded" };

      if (tokenObjA.token && tokenATcAddress) {
        const isWhitelisted = await Contract20WS.isWhitelisted(client, tokenObjA.token, pair.contract_addr);
        const status = isWhitelisted ? "done" : "needed";
        tokenAWhitelisting = { status, tcAddress: tokenATcAddress };
      }

      const tokenBTcAddress = await Contract20WS.getTcAddress(client, tokenObjB.token);
      let tokenBWhitelisting: TokenWhitelisting = { status: "unneeded" };

      if (tokenObjB.token && tokenBTcAddress) {
        const isWhitelisted = await Contract20WS.isWhitelisted(client, tokenObjB.token, pair.contract_addr);
        const status = isWhitelisted ? "done" : "needed";
        tokenBWhitelisting = { status, tcAddress: tokenBTcAddress };
      }

      const pairWhitelisting: PairWhitelisting = { tokenA: tokenAWhitelisting, tokenB: tokenBWhitelisting };
      const pairWithAuth: PairWithAuth = { ...pair, whitelisting: pairWhitelisting };
      setPair(pairWithAuth);
      await loadPairToProvider(pairWithAuth.contract_addr);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }, [client, config.factoryAddress, config.feeToken, handleError, loadPairToProvider, tokenFrom, tokenTo]);

  useEffect(() => {
    getPairWithAuth();
  }, [getPairWithAuth]);

  const loadPool = useCallback(async () => {
    if (!client || !pair) return;

    try {
      const pool = await PoolContract.queryPool(client, pair.contract_addr);
      setPool(pool);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }, [client, handleError, pair]);

  useEffect(() => {
    loadPool();
  }, [loadPool]);

  useEffect(() => {
    if (!tokenFrom || !tokenTo) return setStep("select");
    if (!pair) return setStep("create");

    if (
      tokenFrom.approval === "needed" ||
      tokenTo.approval === "needed" ||
      pair.whitelisting?.tokenA.status === "needed" ||
      pair.whitelisting?.tokenB.status === "needed"
    )
      return setStep("authorize");

    if (isPoolEmpty) return setStep("fund");

    // TODO: check URL to do swap / fund / withdraw
    setStep("swap");
  }, [isPoolEmpty, pair, tokenFrom, tokenTo]);

  const showFundPairForm = isPoolEmpty && step === "fund";
  const showOperatePairForm = !isPoolEmpty && (step === "swap" || step === "fund" || step === "withdraw");

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        padding: "20px",
        border: "1px solid #EDEEEE",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {step === "select" ? (
        <Text>Two tokens need to be selected before being able to operate with them.</Text>
      ) : null}
      {step === "create" ? <CreatePairForm setTxResult={setTxResult} loadPair={getPairWithAuth} /> : null}
      {step === "authorize" && tokenFrom && tokenTo && pair ? (
        <AuthorizePairForm
          tokenFrom={tokenFrom}
          tokenTo={tokenTo}
          pair={pair}
          setTxResult={setTxResult}
          reloadToken={getTokenWithAuth}
        />
      ) : null}
      {showFundPairForm && tokenFrom && tokenTo && pair ? (
        <FundPairForm tokenFrom={tokenFrom} tokenTo={tokenTo} pair={pair} setTxResult={setTxResult} />
      ) : null}
      {showOperatePairForm ? <OperatePairForm /> : null}
      <ShowTxResultModal txResult={txResult} setTxResult={setTxResult} />
    </div>
  );
}
