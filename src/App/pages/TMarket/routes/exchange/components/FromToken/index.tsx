import TokenRow from "App/pages/TMarket/components/TokenRow";
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
  const { estimatingFromA } = tMarketState;

  const setToken = (token: TokenProps) => {
    setValues({
      ...values,
      selectFrom: token,
      selectTo: values.selectTo?.address === token.address ? values.selectFrom : values.selectTo,
    });
  };

  const setMax = (): void => {
    if (!values.selectFrom) return;

    const balanceMinusGas = Number(values.selectFrom.humanBalance) - Number(config.gasPrice.amount);
    if (balanceMinusGas < 0) return;

    if (values.selectFrom) {
      setValues({ ...values, From: balanceMinusGas.toString() });
    }
    setEstimatingFromA(tMarketDispatch);
  };

  useEffect(() => {
    (async () => {
      if (!client || !address || !values.selectFrom || !values.selectTo || !estimatingFromA) return;
      //QUERY simulation
      if (Number(values.From) > 0 && swapButton.type === "swap" && selectedPair) {
        const simulation_result: SimulatedSwap | null = await Token.getSimulation(
          client,
          selectedPair,
          values,
        );
        if (!simulation_result) return;
        setSimulatedSwap(exchangeDispatch, simulation_result);
        setFieldValue("To", parseFloat(simulation_result.return_amount));
      } else {
        setFieldValue("To", "");

        setSimulatedSwap(exchangeDispatch, undefined);
      }
    })();
    //eslint-disable-next-line
  }, [tMarketState.estimatingFromA, values.From]);

  const onChange = (): void => setEstimatingFromA(tMarketDispatch);
  return (
    <TokenRow
      tokenFilter="exclude-lp"
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
