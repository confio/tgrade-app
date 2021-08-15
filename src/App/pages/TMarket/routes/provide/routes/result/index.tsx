import { paths } from "App/paths";
import TransactionDetail, { DetailRow } from "App/routes/TMarket/components/TransactionDetail";
import { HorizontalDivider, OkButton } from "App/routes/TMarket/components/TransactionDetail/style";
import { Redirect } from "react-router-dom";
import copyToClipboard from "clipboard-copy";
import Tag from "./style";
import { setDetailProvide, useProvide } from "service/provide";

const ProvideResult = (): JSX.Element => {
  const { provideState, provideDispatch } = useProvide();
  const { detailProvide, extraInfo } = provideState;
  let lpFromTx;
  if (!detailProvide) {
    return <Redirect to={`${paths.tmarket.prefix}${paths.tmarket.provide.prefix}`} />;
  }
  if (!extraInfo) {
    lpFromTx = "~";
  } else {
    lpFromTx = extraInfo.lpFromTx;
  }
  return (
    <TransactionDetail>
      <HorizontalDivider />
      <DetailRow title="Provide" value={detailProvide.providedA} />
      <HorizontalDivider />
      <DetailRow title="Provide" value={detailProvide.providedB} />
      <HorizontalDivider />
      <DetailRow title="Received" value={lpFromTx} />
      <HorizontalDivider />
      <DetailRow title="Tx Hash" value={<TxHash value={detailProvide.txHash} />} />
      <HorizontalDivider />
      <DetailRow title="Fee" value={detailProvide.fee} />
      <HorizontalDivider />
      <OkButton onClick={() => setDetailProvide(provideDispatch, undefined)}>Ok</OkButton>
    </TransactionDetail>
  );
};
export default ProvideResult;

const TxHash = (props: { value: string }): JSX.Element => {
  const { value } = props;
  const offset = 8;
  if (value.length < offset * 2) return <>----</>;

  const shortV = `${value.substring(0, offset)}...${value.substring(value.length - offset, value.length)}`;

  return <Tag onClick={() => copyToClipboard(value)}>{shortV}</Tag>;
};
