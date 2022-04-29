import copyIcon from "App/assets/icons/copy-white.svg";
import TransactionDetail, { DetailRow } from "App/pages/TMarket/components/TransactionDetail";
import { HorizontalDivider, OkButton } from "App/pages/TMarket/components/TransactionDetail/style";
import { paths } from "App/paths";
import copyToClipboard from "clipboard-copy";
import { Redirect } from "react-router-dom";
import { setDetailProvide, useProvide } from "service/provide";

import { StyledModal, StyledTag, TxHashContainer } from "./style";

interface ProvideResultModalProps {
  readonly isModalOpen: boolean;
}

export default function ProvideResultModal({ isModalOpen }: ProvideResultModalProps): JSX.Element {
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
      {detailProvide ? (
        <TransactionDetail>
          <DetailRow title="Provide" value={detailProvide.providedA} />
          <HorizontalDivider />
          <DetailRow title="Provide" value={detailProvide.providedB} />
          <HorizontalDivider />
          <DetailRow title="Received" value={lpFromTx} />
          <HorizontalDivider />
          <DetailRow title="Tx Hash" value={<TxHash value={detailProvide.txHash} />} />
          <HorizontalDivider />
          <DetailRow title="Fee" value={detailProvide.fee} />
          <OkButton onClick={() => setDetailProvide(provideDispatch, undefined)}>Ok</OkButton>
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
