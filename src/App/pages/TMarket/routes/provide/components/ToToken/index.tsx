import TokenRow from "App/routes/TMarket/components/TokenRow";
import { useFormikContext } from "formik";
import { setEstimatingFromB, useTMarket } from "service/tmarket";
import {
  ExtraInfoProvide,
  Pool,
  PoolProps,
  ProvideFormValues,
  SimulatedSwap,
  SwapFormValues,
  Token,
  TokenProps,
} from "utils/tokens";
import { setSimulationProvide, useProvide, setPool, setIsPoolEmpty, setExtraInfo } from "service/provide";
import { useSdk } from "service";
import { useEffect } from "react";
import { getTokensList } from "App/routes/TMarket/utils";

const ToToken = (): JSX.Element => {
  const { values, setValues, setFieldValue } = useFormikContext<ProvideFormValues>();
  const { sdkState } = useSdk();
  const { provideState, provideDispatch } = useProvide();
  const { tMarketState, tMarketDispatch } = useTMarket();
  const { client, address } = sdkState;
  const { estimatingFromB, pairs, searchText } = tMarketState;
  const { selectedPair } = provideState;
  const setToken = (token: TokenProps) => {
    setValues({
      ...values,
      selectTo: token,
    });
  };

  useEffect(() => {
    (async () => {
      if (
        !client ||
        !address ||
        !values.selectFrom ||
        !values.selectTo ||
        !pairs ||
        !estimatingFromB ||
        !selectedPair
      )
        return;

      if (values.assetB > 0) {
        const val: SwapFormValues = {
          selectFrom: values.selectFrom,
          selectTo: values.selectTo,
          From: values.assetA,
          To: values.assetB,
        };
        const pool_result: PoolProps = await Pool.queryPool(client, selectedPair?.contract_addr);
        if (parseFloat(pool_result.total_share) === 0) {
          setIsPoolEmpty(provideDispatch, true);
          return;
        } else {
          setIsPoolEmpty(provideDispatch, false);
        }
        const simulation_result: SimulatedSwap | null = await Token.getSimulationReverse(
          client,
          selectedPair,
          val,
        );
        if (!simulation_result) return;
        setSimulationProvide(provideDispatch, simulation_result);
        setPool(provideDispatch, pool_result);
        setFieldValue("assetA", parseFloat(simulation_result.return_amount));
        const extraInfo: ExtraInfoProvide | null = await Pool.getPoolExtraInfo(
          client,
          selectedPair.contract_addr,
          values,
          pool_result,
        );

        if (!extraInfo) return;
        setExtraInfo(provideDispatch, extraInfo);
      } else {
        setFieldValue("assetA", 0);
        setSimulationProvide(provideDispatch, undefined);
        setPool(provideDispatch, undefined);
      }
    })();
    //eslint-disable-next-line
  }, [estimatingFromB, values.assetB]);

  const tokens: TokenProps[] = getTokensList(tMarketState.tokens, searchText);
  const onChange = (): void => setEstimatingFromB(tMarketDispatch);
  return (
    <TokenRow
      tokens={tokens}
      id="assetB"
      error={provideState.errors.to}
      setToken={setToken}
      token={values.selectTo}
      position="Bottom"
      maxButton={false}
      title="Asset"
      onChange={onChange}
    />
  );
};

export default ToToken;
