import { StdFee } from "@cosmjs/stargate";
import { Col } from "antd";
import InfoRow from "App/components/InfoRow";
import { useFormikContext } from "formik";
import { useWithdraw } from "service/withdraw";
import { SwapFormValues } from "utils/tokens";

import { formatTgdFee } from "../../../exchange/utils/fees";
import Divider from "./style";

interface ExtraInfoProps {
  readonly fee: StdFee;
}

const ExtraInfo = ({ fee }: ExtraInfoProps): JSX.Element | null => {
  const { withdrawState } = useWithdraw();
  const { values } = useFormikContext<SwapFormValues>();
  const { detail } = withdrawState;

  if (!detail || !values.From || !values.selectFrom) return null;

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
        <InfoRow label="Tx Fee" value={formatTgdFee(fee)} tooltip={tooltips.txFee} />
      </Col>
      <Divider />
    </>
  );
};

export default ExtraInfo;
