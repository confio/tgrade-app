import switchIcon from "App/assets/icons/arrows-up-down.svg";
import ButtonCircle from "App/components/ButtonCircle";
import { useFormikContext } from "formik";
import { setEstimatingSwitch, useTMarket } from "service/tmarket";
import { SwapFormValues } from "utils/tokens";

const handleSwitchTokens = (values: SwapFormValues, setValues: any, switchState: () => void): void => {
  if (!values) return;
  const { From, selectFrom } = values;
  switchState();
  setValues({
    From: values.To,
    selectFrom: values.selectTo,
    To: From,
    selectTo: selectFrom,
  });
};

const SwitchTokensButton = (): JSX.Element => {
  const { values, setValues } = useFormikContext<SwapFormValues>();
  const { tMarketState, tMarketDispatch } = useTMarket();
  const switchState = () =>
    setEstimatingSwitch(tMarketDispatch, tMarketState.estimatingFromA, tMarketState.estimatingFromB);

  return (
    <ButtonCircle onClick={() => handleSwitchTokens(values, setValues, switchState)}>
      <img src={switchIcon} alt="Switch tokens" />
    </ButtonCircle>
  );
};

export default SwitchTokensButton;
