import TokenRow from "App/pages/TMarket/components/TokenRow";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useSdk } from "service";
import { setExtraInfo, setIsPoolEmpty, setPool, setSimulationProvide, useProvide } from "service/provide";
import { setEstimatingFromA, useTMarket } from "service/tmarket";
import {
  ExtraInfoProvide,
  Pool,
  PoolContract,
  ProvideFormValues,
  SimulatedSwap,
  SwapFormValues,
  TokenContract,
  TokenHuman,
} from "utils/tokens";

const FromToken = (): JSX.Element => {
  const { values, setValues, setFieldValue } = useFormikContext<ProvideFormValues>();
  const { sdkState } = useSdk();
  const { provideState, provideDispatch } = useProvide();
  const { tMarketState, tMarketDispatch } = useTMarket();
  const { client, address } = sdkState;
  const { estimatingFromA } = tMarketState;
  const { selectedPair, provideButtonState, isTokenApprovedA } = provideState;

  const setToken = (token: TokenHuman) => {
    setValues({
      ...values,
      selectFrom: token,
      selectTo: values.selectTo?.address === token.address ? values.selectFrom : values.selectTo,
    });
  };

  const setMax = (): void => {
    setEstimatingFromA(tMarketDispatch);
    if (values.selectFrom) {
      setValues({
        ...values,
        assetA: (Number(values.selectFrom.humanBalance) - Number(sdkState.config.gasPrice.amount)).toString(),
      });
    }
  };

  useEffect(() => {
    (async () => {
      if (!client || !address || !values.selectFrom || !values.selectTo || !estimatingFromA || !selectedPair)
        return;

      if (values.assetA && Number(values.assetA) > 0 && values.assetB) {
        const pool_result: Pool = await PoolContract.queryPool(client, selectedPair?.contract_addr);

        if (parseFloat(pool_result.total_share) === 0) {
          setIsPoolEmpty(provideDispatch, true);
          return;
        } else {
          setIsPoolEmpty(provideDispatch, false);
        }
        const val: SwapFormValues = {
          selectFrom: values.selectFrom,
          selectTo: values.selectTo,
          From: values.assetA,
          To: values.assetB,
        };
        const simulation_result: SimulatedSwap | null = await TokenContract.getSimulation(
          client,
          selectedPair,
          val,
        );
        if (!simulation_result) return;
        setSimulationProvide(provideDispatch, simulation_result);
        setPool(provideDispatch, pool_result);
        setFieldValue("assetB", parseFloat(simulation_result.return_amount));
        const extraInfo: ExtraInfoProvide | null = await PoolContract.getPoolExtraInfo(
          client,
          selectedPair.contract_addr,
          values,
          pool_result,
        );

        if (!extraInfo) return;
        setExtraInfo(provideDispatch, extraInfo);
      } else {
        setSimulationProvide(provideDispatch, undefined);
        setExtraInfo(provideDispatch, undefined);
        setPool(provideDispatch, undefined);
      }
    })();
    //eslint-disable-next-line
  }, [estimatingFromA, values.assetA]);

  const onChange = (): void => setEstimatingFromA(tMarketDispatch);

  return (
    <TokenRow
      tokenFilter="exclude-lp"
      id="assetA"
      error={provideState.errors.from}
      setToken={setToken}
      token={values.selectFrom}
      position="Top"
      title="Asset"
      onMaxClick={setMax}
      onChange={onChange}
      disabledInput={!selectedPair || provideButtonState.type !== "provide" || !isTokenApprovedA}
    />
  );
};

export default FromToken;
