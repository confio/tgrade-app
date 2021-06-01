import Button from "App/components/form/Button";
import { paths } from "App/paths";
import * as React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { closeAddDsoModal, useDso } from "service";
import modalBg from "./assets/modal-background.jpg";
import AddExistingDso from "./components/AddExistingDso";
import CreateDso from "./components/CreateDso";
import ShowTxResult, { TxResult } from "./components/ShowTxResult";
import { StyledModal } from "./style";

enum AddDsoSteps {
  Existing = "Existing",
  Create = "Create",
}

export default function AddDsoModal(): JSX.Element {
  const history = useHistory();
  const { dsoState, dsoDispatch } = useDso();

  const [addDsoStep, setAddDsoStep] = useState(AddDsoSteps.Existing);
  const [txResult, setTxResult] = useState<TxResult>();

  function goToNewDso(address?: string) {
    if (address) history.push(`${paths.dso.prefix}/${address}`);
    closeAddDsoModal(dsoDispatch);
    setAddDsoStep(AddDsoSteps.Existing);
    setTxResult(undefined);
  }

  return (
    <StyledModal
      centered
      footer={null}
      closable={false}
      visible={dsoState.addDsoModalState === "open"}
      width="100%"
      bgTransparent={!!txResult}
      style={{
        maxWidth: "59.5rem",
      }}
      maskStyle={{
        background: `linear-gradient(0deg, rgba(4, 119, 120, 0.9), rgba(4, 119, 120, 0.9)), url(${modalBg})`,
        backgroundSize: "cover",
      }}
    >
      {txResult ? (
        <ShowTxResult {...txResult}>
          {txResult.error ? (
            <Button onClick={() => setTxResult(undefined)}>
              <span>Try again</span>
            </Button>
          ) : null}
          <Button onClick={() => goToNewDso(txResult.contractAddress)}>
            <span>Go to DSO details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <>
          {addDsoStep === AddDsoSteps.Existing ? (
            <AddExistingDso
              setTxResult={setTxResult}
              goToCreateDso={() => setAddDsoStep(AddDsoSteps.Create)}
            />
          ) : addDsoStep === AddDsoSteps.Create ? (
            <CreateDso
              setTxResult={setTxResult}
              goToAddExistingDso={() => setAddDsoStep(AddDsoSteps.Existing)}
            />
          ) : null}
        </>
      )}
    </StyledModal>
  );
}
