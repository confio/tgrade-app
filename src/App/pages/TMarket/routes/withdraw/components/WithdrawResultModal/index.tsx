import { Tooltip } from "antd";
import copyIcon from "App/assets/icons/copy.svg";
import TransactionDetail, { DetailRow } from "App/pages/TMarket/components/TransactionDetail";
import { HorizontalDivider, OkButton } from "App/pages/TMarket/components/TransactionDetail/style";
import { paths } from "App/paths";
import copyToClipboard from "clipboard-copy";
import { Redirect } from "react-router-dom";
import { setDetailWithdraw, useWithdraw } from "service/withdraw";

import { StyledModal, StyledTag, TxHashContainer } from "./style";

interface WithdrawResultModalProps {
  readonly isModalOpen: boolean;
}

export default function WithdrawResultModal({ isModalOpen }: WithdrawResultModalProps): JSX.Element {
  const { withdrawState, withdrawDispatch } = useWithdraw();
  const { detail } = withdrawState;

  if (!detail) {
    return <Redirect to={`${paths.tmarket.prefix}${paths.tmarket.withdraw.prefix}`} />;
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
      {detail ? (
        <TransactionDetail>
          <DetailRow title="Withdraw" value={detail.withdrawTokenA} />
          <HorizontalDivider />
          <DetailRow title="Withdraw" value={detail.withdrawTokenB} />
          <HorizontalDivider />
          <DetailRow title="Exchanged LP tokens" value={detail.exchanged} />
          <HorizontalDivider />
          <DetailRow title="Tx Hash" value={<TxHash value={detail.txHash} />} />
          <HorizontalDivider />
          <DetailRow title="Fee" value={detail.fee} />
          <OkButton onClick={() => setDetailWithdraw(withdrawDispatch, undefined)}>Ok</OkButton>
        </TransactionDetail>
      ) : null}
    </StyledModal>
  );
}

const TxHash = ({ value }: { value: string }): JSX.Element => {
  return (
    <TxHashContainer>
      <StyledTag>{value}</StyledTag>
      <Tooltip trigger="click" title="Hash Copied">
        <img src={copyIcon} alt="Copy button" onClick={() => copyToClipboard(value)} />
      </Tooltip>
    </TxHashContainer>
  );
};
