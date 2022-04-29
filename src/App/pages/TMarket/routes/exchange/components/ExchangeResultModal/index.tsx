import copyIcon from "App/assets/icons/copy-white.svg";
import TransactionDetail, { DetailRow } from "App/pages/TMarket/components/TransactionDetail";
import { HorizontalDivider, OkButton } from "App/pages/TMarket/components/TransactionDetail/style";
import { paths } from "App/paths";
import copyToClipboard from "clipboard-copy";
import { useHistory } from "react-router";
import { useSdk } from "service";
import { setDetailSwap, useExchange } from "service/exchange";

import { StyledModal, StyledTag, TxHashContainer } from "./style";

interface ExchangeResultModalProps {
  readonly isModalOpen: boolean;
}

export default function ExchangeResultModal({ isModalOpen }: ExchangeResultModalProps): JSX.Element | null {
  const history = useHistory();
  const { exchangeState, exchangeDispatch } = useExchange();
  const { detailSwap } = exchangeState;
  const {
    sdkState: { config },
  } = useSdk();

  function closeResult() {
    setDetailSwap(exchangeDispatch, undefined);
    history.push(`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}`);
  }

  return (
    <StyledModal
      centered
      footer={null}
      closable={false}
      visible={isModalOpen}
      width="100%"
      style={{
        right: "-40px",
        maxWidth: "50rem",
        paddingRight: "60px",
      }}
      bodyStyle={{
        position: "relative",
        padding: "var(--s1)",
        borderRadius: "16px",
        backgroundColor: "var(--bg-body)",
      }}
      maskStyle={{ background: "rgba(26, 29, 38,0.6)" }}
    >
      {detailSwap ? (
        <TransactionDetail>
          <DetailRow title="From" value={detailSwap.from} />
          <HorizontalDivider />
          <DetailRow title="To" value={detailSwap.to} />
          <DetailRow title="Spread" value={detailSwap.spread} />
          <DetailRow title="Commission" value={detailSwap.commission} />
          <HorizontalDivider />
          <DetailRow title="Tx Hash" value={<TxHash value={detailSwap.txHash} />} />
          <HorizontalDivider />
          <DetailRow title="Fee" value={`${detailSwap.fee} ${config.coinMap[config.feeToken].denom}`} />
          <OkButton onClick={closeResult}>Ok</OkButton>
        </TransactionDetail>
      ) : null}
    </StyledModal>
  );
}

const TxHash = ({ value }: { value: string }): JSX.Element => {
  return (
    <TxHashContainer>
      <StyledTag>{value}</StyledTag>
      <img src={copyIcon} alt="Copy button" onClick={() => copyToClipboard(value)} />
    </TxHashContainer>
  );
};
