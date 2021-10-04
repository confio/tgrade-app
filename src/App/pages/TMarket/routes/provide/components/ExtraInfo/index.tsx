import { Col } from "antd";
import InfoRow from "App/components/InfoRow";
import { useFormikContext } from "formik";
import { useSdk } from "service";
import { ProvideFormValues } from "utils/tokens";
import { useProvide } from "service/provide";
import Divider from "./style";

const ExtraInfo = (): JSX.Element | null => {
  const { provideState } = useProvide();
  const { sdkState } = useSdk();
  const { client, config } = sdkState;
  const { values } = useFormikContext<ProvideFormValues>();
  const { extraInfo } = provideState;

  if (!client || !values.selectFrom || !values.selectTo || !extraInfo) return null;
  // const a = pool;
  // if (a.assets.length < 0) return null;
  // const poolA = a.assets.find(
  //   (asset) =>
  //     asset.info.native === values.selectFrom?.address || asset.info.token === values.selectFrom?.address,
  // );
  // const poolB = a.assets.find(
  //   (asset) =>
  //     asset.info.native === values.selectTo?.address || asset.info.token === values.selectTo?.address,
  // );

  // if (!poolA || !poolB) return null;
  // const pools =
  //   Decimal.fromAtomics(poolA?.amount, values.selectFrom?.decimals).toFloatApproximation() /
  //   Decimal.fromAtomics(poolB?.amount, values.selectTo?.decimals).toFloatApproximation();
  // const price = numberFormat.format(pools);
  // const priceReverse = numberFormat.format(1 / pools);

  // const amountA = parseFloat(
  //   Decimal.fromUserInput(values.assetA.toString(), values.selectFrom.decimals).toString(),
  // );
  // const amountB = parseFloat(
  //   Decimal.fromUserInput(values.assetB.toString(), values.selectTo.decimals).toString(),
  // );

  // let gainedShareOfPool, LPFromTX: string;
  // const gainedShareOfPoolB = amountB / (parseFloat(poolB.amount) + amountB);
  // const gainedShareOfPoolA = amountA / (parseFloat(poolA.amount) + amountA);

  // if (gainedShareOfPoolA > gainedShareOfPoolB) {
  //   gainedShareOfPool = shareOfPoolNumberFormat.format(gainedShareOfPoolB * 100);
  //   LPFromTX = (parseFloat(pool.total_share) * gainedShareOfPoolA).toFixed(6);
  // } else {
  //   gainedShareOfPool = shareOfPoolNumberFormat.format(gainedShareOfPoolA * 100);
  //   LPFromTX = (parseFloat(pool.total_share) * gainedShareOfPoolB).toFixed(6);
  // }
  return (
    <>
      <Col offset={5} span={15}>
        <InfoRow
          label={`${values.selectFrom.symbol} price`}
          value={`${extraInfo.priceReverse} ${values.selectTo.symbol} per ${values.selectFrom.symbol}`}
          tooltip={""}
        />
        <InfoRow
          label={`${values.selectTo.symbol} price`}
          value={`${extraInfo.price} ${values.selectFrom.symbol} per ${values.selectTo.symbol}`}
          tooltip={""}
        />
        <InfoRow
          label={`LP from Tx`}
          value={`${extraInfo.lpFromTx}`}
          tooltip={"LP received from providing liquidity"}
        />
        <InfoRow
          label={`Pool Share after Tx`}
          value={`${extraInfo.gainedShareOfPool} %`}
          tooltip={"Contribution percentage to the pool"}
        />
        <InfoRow
          label={`Tx fee`}
          value={`${config.gasPrice} ${config.coinMap.utgd.denom}`}
          tooltip={
            "The Tx fee is charged by the blockchain data centers for processing your data transactions."
          }
        />
      </Col>
      <Divider />
    </>
  );
};

export default ExtraInfo;
