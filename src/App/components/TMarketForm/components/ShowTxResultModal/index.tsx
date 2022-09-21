import Button from "App/components/Button";
import ShowTxResult, { TxResult } from "App/components/ShowTxResult";

import { StyledModal } from "./style";

interface ShowTxResultModalProps {
  readonly txResult: TxResult | undefined;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ShowTxResultModal({
  txResult,
  setTxResult,
}: ShowTxResultModalProps): JSX.Element | null {
  return (
    <StyledModal
      centered
      footer={null}
      closable={false}
      visible={!!txResult}
      width="100%"
      bgTransparent={!!txResult}
      style={{
        right: "-40px",
        maxWidth: "40rem",
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
      {txResult ? (
        <ShowTxResult {...txResult}>
          {txResult.error ? (
            <Button onClick={() => setTxResult(undefined)}>
              <span>Try again</span>
            </Button>
          ) : null}
          <Button onClick={() => setTxResult(undefined)}>
            <span data-cy="wallet-dialog-send-token-modal-go-to-wallet-button">Go to T-Market</span>
          </Button>
        </ShowTxResult>
      ) : null}
    </StyledModal>
  );
}
