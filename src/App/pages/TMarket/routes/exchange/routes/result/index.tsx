import { paths } from "App/paths";
import TransactionDetail, { DetailRow } from "App/pages/TMarket/components/TransactionDetail";
import { HorizontalDivider, OkButton } from "App/pages/TMarket/components/TransactionDetail/style";
import { Redirect } from "react-router-dom";
import copyToClipboard from "clipboard-copy";
import Tag from "./style";

import { setDetailSwap, useExchange } from "service/exchange";

const ExchangeResult = (): JSX.Element => {
  const { exchangeState, exchangeDispatch } = useExchange();
  const { detailSwap } = exchangeState;

  if (!detailSwap) {
    return <Redirect to={`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}`} />;
  }

  return (
    <TransactionDetail>
      <HorizontalDivider />
      <DetailRow title="From" value={detailSwap.from} />
      <HorizontalDivider />
      <DetailRow title="To" value={detailSwap.to} />
      <DetailRow title="Spread" value={detailSwap.spread} />
      <DetailRow title="Commission" value={detailSwap.commission} />
      <HorizontalDivider />
      <DetailRow title="Tx Hash" value={<TxHash value={detailSwap.txHash} />} />
      <HorizontalDivider />
      <DetailRow title="Fee" value={detailSwap.fee} />
      <HorizontalDivider />
      <OkButton onClick={() => setDetailSwap(exchangeDispatch, undefined)}>Ok</OkButton>
    </TransactionDetail>
  );
};
export default ExchangeResult;

const TxHash = (props: { value: string }): JSX.Element => {
  const { value } = props;
  const offset = 8;
  if (value.length < offset * 2) return <>----</>;

  const shortV = `${value.substring(0, offset)}...${value.substring(value.length - offset, value.length)}`;

  return <Tag onClick={() => copyToClipboard(value)}>{shortV}</Tag>;
};
