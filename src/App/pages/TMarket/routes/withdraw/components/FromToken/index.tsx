import { TokenRow } from "App/pages/TMarket/components";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useSdk } from "service";
import { useTMarket } from "service/tmarket";
import { Pool, PoolProps, TokenProps, WithdrawFormValues } from "utils/tokens";
import { useWithdraw, setSelectedLP, setErrors, FormErrors, setDetailWithdraw } from "service/withdraw";
import { Decimal } from "@cosmjs/math";
import { getLPTokensList } from "App/pages/TMarket/utils";
const FromToken = (): JSX.Element => {
  const { values, setValues, setFieldValue } = useFormikContext<WithdrawFormValues>();
  const { tMarketState } = useTMarket();
  const { withdrawState, withdrawDispatch } = useWithdraw();
  const { sdkState } = useSdk();
  const { lpTokens, estimatingFromA, tokens, searchText } = tMarketState;
  const { client, config } = sdkState;
  const setToken = (value: TokenProps) => {
    setValues({
      ...values,
      selectFrom: value,
    });
  };

  const setMax = (): void => {
    if (values.selectFrom) {
      setValues({ ...values, From: parseFloat(values.selectFrom.humanBalance) });
    }
  };

  useEffect(() => {
    (async () => {
      const errors: FormErrors = {
        to: undefined,
        from: undefined,
      };
      if (!values.selectFrom || !client || values.From === 0) {
        setErrors(withdrawDispatch, errors);
        return;
      }
      const lpToken = lpTokens[values.selectFrom.address];
      if (!lpToken) return;
      const token = lpToken.token;
      const result: PoolProps = await Pool.queryPool(client, lpToken.pair.contract_addr);
      const total_supply = Decimal.fromAtomics(token.total_supply, token.decimals).toFloatApproximation();
      if (values.From > total_supply) {
        errors.from = "Insufficient liquidity for withdrawing this quantity";
        setErrors(withdrawDispatch, errors);
        return;
      }
      const indexA = result.assets[0].info?.native || result.assets[0].info?.token;
      const indexB = result.assets[1].info?.native || result.assets[1].info?.token;
      if (!indexA || !indexB) return;
      const symbolA = tokens[result.assets[0].info?.native || result.assets[0].info?.token || ""].symbol;
      const symbolB = tokens[result.assets[1].info?.native || result.assets[1].info?.token || ""].symbol;
      const amountA = Decimal.fromAtomics(result.assets[0].amount, 6).toFloatApproximation();
      const amountB = Decimal.fromAtomics(result.assets[1].amount, 6).toFloatApproximation();
      const received_a = ((amountA / total_supply) * values.From).toFixed(2);
      const received_b = ((amountB / total_supply) * values.From).toFixed(2);
      const priceImpact = ((values.From * 100) / total_supply).toFixed(2);
      const shareAfterTx = (
        ((parseFloat(values.selectFrom.humanBalance) - values.From) * 100) /
        total_supply
      ).toFixed(2);

      setFieldValue("To", `${symbolA} ${received_a} - ${symbolB} ${received_b}`);

      if (values.From > parseFloat(values.selectFrom.humanBalance)) {
        errors.from = "Insufficient Balance";
      }
      setDetailWithdraw(withdrawDispatch, {
        withdrawTokenA: `${received_a} ${symbolA}`,
        withdrawTokenB: `${received_b} ${symbolB}`,
        priceImpact: priceImpact,
        lpAfter: `-${values.From} LP`,
        sharePool: `${shareAfterTx} %`,
        txHash: "",
        burned: `${values.From} LP`,
        fee: (Number(config.gasPrice.amount) / 2).toString(),
      });
      setSelectedLP(withdrawDispatch, lpToken);
      setErrors(withdrawDispatch, errors);
    })();
    //eslint-disable-next-line
  }, [estimatingFromA, values.From]);

  const tokensArr = getLPTokensList(tMarketState.lpTokens, searchText);
  return (
    <TokenRow
      id="From"
      tokens={tokensArr}
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
