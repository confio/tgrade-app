import Button from "App/components/form/Button";
import ShowTxResult, { TxResult } from "App/components/logic/ShowTxResult";
import * as React from "react";

interface ShowTxResultProposalProps {
  readonly txResult: TxResult;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
  readonly tryAgain: () => void;
  readonly resetModal: () => void;
}

export default function ShowTxResultProposal({
  txResult,
  setTxResult,
  tryAgain,
  resetModal,
}: ShowTxResultProposalProps): JSX.Element {
  return (
    <ShowTxResult {...txResult}>
      {txResult.error ? (
        <Button onClick={() => tryAgain()}>
          <span>Try again</span>
        </Button>
      ) : null}
      <Button onClick={() => resetModal()}>
        <span>Go to DSO details</span>
      </Button>
    </ShowTxResult>
  );
}
