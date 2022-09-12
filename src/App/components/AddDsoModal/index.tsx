import { useState } from "react";
import { useHistory } from "react-router-dom";
import { closeAddDsoModal, useDso } from "service";

import Button from "../../../App/components/Button";
import ShowTxResult, { TxResult } from "../../../App/components/ShowTxResult";
import { paths } from "../../paths";
import AddExistingDso from "./components/AddExistingDso";
import CreateDso from "./components/CreateDso";
import StyledAddDsoModal from "./style";

enum AddDsoSteps {
  Existing = "Existing",
  Create = "Create",
}

export const initialCreateDsoValues = {
  dsoName: "",
  votingDuration: "14",
  quorum: "1",
  threshold: "50.01",
  allowEndEarly: true,
};

export default function AddDsoModal(): JSX.Element {
  const history = useHistory();
  const { dsoState, dsoDispatch } = useDso();

  const [addDsoStep, setAddDsoStep] = useState(AddDsoSteps.Existing);
  const [txResult, setTxResult] = useState<TxResult>();
  const [createDsoData, setCreateDsoData] = useState(initialCreateDsoValues);

  function goToNewDso(address?: string) {
    if (address) history.push(`${paths.dso.prefix}/${address}`);
    closeAddDsoModal(dsoDispatch);
    setAddDsoStep(AddDsoSteps.Existing);
    setTxResult(undefined);
  }

  return (
    <StyledAddDsoModal
      centered
      footer={null}
      closable={false}
      visible={dsoState.addDsoModalState === "open"}
      width="100%"
      bgTransparent={!!txResult}
      style={{
        right: "-40px",
        maxWidth: "63.25rem",
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
          <Button onClick={() => goToNewDso(txResult.contractAddress)}>
            <span>Go to Trusted Circle details</span>
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
              createDsoData={createDsoData}
              setCreateDsoData={setCreateDsoData}
              goToAddExistingDso={() => setAddDsoStep(AddDsoSteps.Existing)}
            />
          ) : null}
        </>
      )}
    </StyledAddDsoModal>
  );
}
