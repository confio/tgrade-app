import { Decimal } from "@cosmjs/math";
import { TokenRow } from "App/pages/TMarket/components";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useSdk } from "service";
import { useTMarket } from "service/tmarket";
import { useTokens } from "service/tokens";
import { FormErrors, setDetailWithdraw, setErrors, setSelectedLP, useWithdraw } from "service/withdraw";
import { Contract20WS } from "utils/cw20";
import { Pool, PoolProps, TokenProps, WithdrawFormValues } from "utils/tokens";

const FromToken = (): JSX.Element => {
  const { values, setValues, setFieldValue } = useFormikContext<WithdrawFormValues>();
  const {
    tokensState: { tokens, pairs },
  } = useTokens();
  const {
    tMarketState: { estimatingFromA },
  } = useTMarket();
  const { withdrawState, withdrawDispatch } = useWithdraw();
  const { sdkState } = useSdk();
  const { address, client, config } = sdkState;
  const setToken = (value: TokenProps) => {
    setValues({
      ...values,
      selectFrom: value,
    });
  };

  const setMax = (): void => {
    if (values.selectFrom) {
      setValues({ ...values, From: values.selectFrom.humanBalance });
    }
  };

  useEffect(() => {
    (async () => {
      const errors: FormErrors = {
        to: undefined,
        from: undefined,
      };
      if (!address || !values.selectFrom || !client || Number(values.From) === 0) {
        setErrors(withdrawDispatch, errors);
        return;
      }

      const lpToken = tokens.get(values.selectFrom.address);
      if (!lpToken) return;

      const pair = Object.values(pairs).find((pair) => pair.liquidity_token === lpToken.address);
      if (!pair) return;

      const result: PoolProps = await Pool.queryPool(client, pair.contract_addr);
      const total_supply = Decimal.fromAtomics(lpToken.total_supply, lpToken.decimals).toFloatApproximation();
      if (Number(values.From) > total_supply) {
        errors.from = "Insufficient liquidity for withdrawing this quantity";
        setErrors(withdrawDispatch, errors);
        return;
      }
      const indexA = result.assets[0].info?.native || result.assets[0].info?.token;
      const indexB = result.assets[1].info?.native || result.assets[1].info?.token;
      if (!indexA || !indexB) return;

      const symbolA = tokens.get(indexA)?.symbol;
      const symbolB = tokens.get(indexB)?.symbol;
      if (!symbolA || !symbolB) return;

      const decimalsA = (
        await Contract20WS.getTokenInfo(
          client,
          address,
          result.assets[0].info?.native || result.assets[0].info?.token || "",
          config,
        )
      ).decimals;
      const decimalsB = (
        await Contract20WS.getTokenInfo(
          client,
          address,
          result.assets[1].info?.native || result.assets[1].info?.token || "",
          config,
        )
      ).decimals;
      const amountA = Decimal.fromAtomics(result.assets[0].amount, decimalsA).toFloatApproximation();
      const amountB = Decimal.fromAtomics(result.assets[1].amount, decimalsB).toFloatApproximation();
      const received_a = ((amountA / total_supply) * Number(values.From)).toFixed(2);
      const received_b = ((amountB / total_supply) * Number(values.From)).toFixed(2);
      const priceImpact = ((Number(values.From) * 100) / total_supply).toFixed(2);
      const shareAfterTx = (
        ((Number(values.selectFrom.humanBalance) - Number(values.From)) * 100) /
        total_supply
      ).toFixed(2);

      setFieldValue("To", `${symbolA} ${received_a} - ${symbolB} ${received_b}`);

      if (Number(values.From) > Number(values.selectFrom.humanBalance)) {
        errors.from = "Insufficient Balance";
      }
      setDetailWithdraw(withdrawDispatch, {
        withdrawTokenA: `${received_a} ${symbolA}`,
        withdrawTokenB: `${received_b} ${symbolB}`,
        priceImpact: priceImpact,
        lpAfter: `-${values.From} LP`,
        sharePool: `${shareAfterTx} %`,
        txHash: "",
        exchanged: `${values.From} LP`,
        fee: (Number(config.gasPrice.amount) / 2).toString(),
      });
      setSelectedLP(withdrawDispatch, { token: lpToken, pair });
      setErrors(withdrawDispatch, errors);
    })();
  }, [
    estimatingFromA,
    address,
    client,
    config,
    pairs,
    setFieldValue,
    tokens,
    values.From,
    values.selectFrom,
    withdrawDispatch,
  ]);

  return (
    <TokenRow
      id="From"
      tokenFilter="lp-only"
      setToken={setToken}
      token={values.selectFrom}
      position="Top"
      title="Liquidity Pool"
      onMaxClick={setMax}
      error={withdrawState.errors.from}
    />
  );
};

export default FromToken;
