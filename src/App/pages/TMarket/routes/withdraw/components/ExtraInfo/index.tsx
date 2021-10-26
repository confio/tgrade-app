import { Col } from "antd";
import InfoRow from "App/components/InfoRow";
import { useFormikContext } from "formik";
import { useSdk } from "service";
import { useWithdraw } from "service/withdraw";
import { SwapFormValues } from "utils/tokens";

import Divider from "./style";

const ExtraInfo = (): JSX.Element | null => {
  const { withdrawState } = useWithdraw();
  const { sdkState } = useSdk();
  const { values } = useFormikContext<SwapFormValues>();
  const { detail } = withdrawState;

  if (!detail || !values.From || !values.selectFrom) return null;
  const fee = PrettyNumber(Number(sdkState.config.gasPrice.amount) / 2);

  const tooltips = {
    poolAfter: "Contribution percentage to the pool",
    txFee: "The Tx fee is an amount charged by miners for processing your transactions.",
  };

  return (
    <>
      <Col offset={5} span={15}>
        <InfoRow label="Price Impact" value={`${detail.priceImpact} %`} />
        <InfoRow label="LP after Tx" value={`${detail.lpAfter}`} />
        <InfoRow label="Pool Share after Tx" value={`${detail.sharePool}`} tooltip={tooltips.poolAfter} />
        <InfoRow label="Tx Fee" value={`${fee}`} tooltip={tooltips.txFee} />
      </Col>
      <Divider />
    </>
  );
};

export default ExtraInfo;

//Makes a large number with to many decimals shorter
//Ex 0.0238454945350234 => 0.0238
const PrettyNumber = (largeNumber: string | number): number => {
  const number = Number(largeNumber);
  return number <= 0 ? 0 : parseFloat(number.toFixed(4));
};
