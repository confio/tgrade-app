import TokenRow from "App/pages/TMarket/components/TokenRow";
import { getTokensList } from "App/pages/TMarket/utils";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useSdk } from "service";
import { setSimulatedSwap, useExchange } from "service/exchange";
import { setEstimatingFromA, useTMarket } from "service/tmarket";
import { SimulatedSwap, SwapFormValues, Token, TokenProps } from "utils/tokens";

const FromToken = (): JSX.Element => {
  const { values, setValues, setFieldValue } = useFormikContext<SwapFormValues>();
  const { sdkState } = useSdk();
  const { exchangeState, exchangeDispatch } = useExchange();
  const { tMarketState, tMarketDispatch } = useTMarket();
  const { config, client, address } = sdkState;
  const { swapButton, selectedPair } = exchangeState;
  const { estimatingFromA, pairs, searchText } = tMarketState;

  const setToken = (token: TokenProps) => {
    setValues({
      ...values,
      selectFrom: token,
      selectTo: values.selectTo?.address === token.address ? values.selectFrom : values.selectTo,
    });
  };

  const setMax = (): void => {
    if (!values.selectFrom) return;
    const humanBalance = Number(values.selectFrom.humanBalance);
    if (humanBalance < Number(config.gasPrice.amount)) return;

    if (values.selectFrom) {
      setValues({ ...values, From: humanBalance - Number(config.gasPrice.amount) });
    }
    setEstimatingFromA(tMarketDispatch);
  };

  useEffect(() => {
    (async () => {
      if (!client || !address || !values.selectFrom || !values.selectTo || !pairs || !estimatingFromA) return;
      //QUERY simulation
      if (values.From > 0 && swapButton.type === "swap" && selectedPair) {
        const simulation_result: SimulatedSwap | null = await Token.getSimulation(
          client,
          selectedPair,
          values,
        );
        if (!simulation_result) return;
        setSimulatedSwap(exchangeDispatch, simulation_result);
        setFieldValue("To", parseFloat(simulation_result.return_amount));
      } else {
        setFieldValue("To", 0);

        setSimulatedSwap(exchangeDispatch, undefined);
      }
    })();
    //eslint-disable-next-line
  }, [tMarketState.estimatingFromA, values.From]);

  const tokens: TokenProps[] = getTokensList(tMarketState.tokens, searchText);

  const onChange = (): void => setEstimatingFromA(tMarketDispatch);
  return (
    <TokenRow
      tokens={tokens}
      error={exchangeState.errors.from}
      setToken={setToken}
      token={values.selectFrom}
      position="Top"
      title="From"
      onMaxClick={setMax}
      onChange={onChange}
    />
  );
};

export default FromToken;
