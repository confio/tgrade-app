import { TokenRowWithdraw } from "App/routes/TMarket/components";
import { useFormikContext } from "formik";
import { useWithdraw } from "service/withdraw";
import { SwapFormValues, TokenProps } from "utils/tokens";

const ToToken = (): JSX.Element => {
  const { values, setValues } = useFormikContext<SwapFormValues>();
  const { withdrawState } = useWithdraw();
  const setToken = (token: TokenProps) => {
    setValues({
      ...values,
      selectTo: token,
    });
  };

  return (
    <TokenRowWithdraw
      id="To"
      tokens={[]}
      hideSelectToken={true}
      setToken={setToken}
      token={values.selectTo}
      position="Bottom"
      title="Received"
      error={withdrawState.errors.to}
    />
  );
};

export default ToToken;
