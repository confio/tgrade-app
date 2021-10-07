import { paths } from "App/paths";
import TransactionDetail, { DetailRow } from "App/pages/TMarket/components/TransactionDetail";
import { HorizontalDivider, OkButton } from "App/pages/TMarket/components/TransactionDetail/style";
import { Redirect } from "react-router-dom";
import copyToClipboard from "clipboard-copy";
import Tag from "./style";
import { setDetailWithdraw, useWithdraw } from "service/withdraw";

const WithdrawResult = (): JSX.Element => {
  const { withdrawState, withdrawDispatch } = useWithdraw();
  const { detail } = withdrawState;

  if (!detail) {
    return <Redirect to={`${paths.tmarket.prefix}${paths.tmarket.withdraw.prefix}`} />;
  }

  return (
    <TransactionDetail>
      <HorizontalDivider />
      <DetailRow title="Withdraw" value={detail.withdrawTokenA} />
      <HorizontalDivider />
      <DetailRow title="Withdraw" value={detail.withdrawTokenB} />
      <HorizontalDivider />
      <DetailRow title="Exchanged LP tokens" value={detail.exchanged} />
      <HorizontalDivider />
      <DetailRow title="Tx Hash" value={<TxHash value={detail.txHash} />} />
      <HorizontalDivider />
      <DetailRow title="Fee" value={detail.fee} />
      <HorizontalDivider />
      <OkButton onClick={() => setDetailWithdraw(withdrawDispatch, undefined)}>Ok</OkButton>
    </TransactionDetail>
  );
};
export default WithdrawResult;

const TxHash = (props: { value: string }): JSX.Element => {
  const { value } = props;
  const offset = 8;
  if (value.length < offset * 2) return <>----</>;

  const shortV = `${value.substring(0, offset)}...${value.substring(value.length - offset, value.length)}`;

  return <Tag onClick={() => copyToClipboard(value)}>{shortV}</Tag>;
};
