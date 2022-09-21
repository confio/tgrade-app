import TokenRow from "App/pages/TMarket/components/TokenRow";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useSdk } from "service";
import { setSimulatedSwap, useExchange } from "service/exchange";
import { setEstimatingFromB, useTMarket } from "service/tmarket";
import { SimulatedSwap, SwapFormValues, TokenContract, TokenHuman } from "utils/tokens";

const ToToken = (): JSX.Element => {
  const { values, setValues, setFieldValue } = useFormikContext<SwapFormValues>();
  const { sdkState } = useSdk();
  const { exchangeState, exchangeDispatch } = useExchange();
  const { tMarketState, tMarketDispatch } = useTMarket();
  const { client, address } = sdkState;
  const { swapButton, selectedPair } = exchangeState;
  const { estimatingFromB } = tMarketState;
  const setToken = (token: TokenHuman) => {
    setValues({
      ...values,
      selectTo: token,
      selectFrom: values.selectFrom?.address === token.address ? values.selectTo : values.selectFrom,
    });
  };
  const onChange = (): void => setEstimatingFromB(tMarketDispatch);

  useEffect(() => {
    (async () => {
      if (!client || !address || !values.selectFrom || !values.selectTo || !estimatingFromB) return;

      if (Number(values.To) > 0 && swapButton.type === "swap" && selectedPair) {
        const simulation_result: SimulatedSwap | null = await TokenContract.getSimulationReverse(
          client,
          selectedPair,
          values,
        );
        if (!simulation_result) return;
        setFieldValue("From", parseFloat(simulation_result.return_amount));
        setSimulatedSwap(exchangeDispatch, simulation_result);
      } else {
        setFieldValue("From", 0);
        setSimulatedSwap(exchangeDispatch, undefined);
      }
    })();
    //eslint-disable-next-line
  }, [values.To]);

  return (
    <TokenRow
      tokenFilter="exclude-lp"
      error={exchangeState.errors.to}
      setToken={setToken}
      token={values.selectTo}
      position="Bottom"
      maxButton={false}
      title="To"
      onChange={onChange}
    />
  );
};

export default ToToken;
