import { Typography } from "antd";
import { Button } from "App/components/form";
import { Stack } from "App/components/layoutPrimitives";
import { paths } from "App/paths";
import * as React from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getDsoName, removeDso, useDso, useError, useSdk } from "service";
import { closeLeaveDsoModal } from "service/dsos";
import { DsoContract } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";
import { DsoHomeParams } from "../../../routes/Dso/routes/DsoHome";
import ShowTxResult, { TxResult } from "../ShowTxResult";
import closeIcon from "./assets/cross.svg";
import modalBg from "./assets/modal-background.svg";
import StyledLeaveDsoModal, { ButtonGroup, ModalHeader, Separator } from "./style";

const { Title, Text } = Typography;

export default function LeaveDsoModal(): JSX.Element {
  const history = useHistory();
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { signingClient, address },
  } = useSdk();
  const {
    dsoState: { dsos, leaveDsoModalState },
    dsoDispatch,
  } = useDso();
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  const dsoName = getDsoName(dsos, dsoAddress);

  function resetModal() {
    closeLeaveDsoModal(dsoDispatch);
    setTxResult(undefined);
    history.push(paths.dso.prefix);
  }

  async function submitLeaveDso() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const dsoContract = new DsoContract(dsoAddress, signingClient);
      const transactionHash = await dsoContract.leaveDso(address);

      setTxResult({
        msg: `Left ${dsoName} (${dsoAddress}). Transaction ID: ${transactionHash}`,
      });
      removeDso(dsoDispatch, dsoAddress);
    } catch (error) {
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <StyledLeaveDsoModal
      centered
      footer={null}
      closable={false}
      visible={leaveDsoModalState === "open"}
      width="100%"
      bgTransparent={!!txResult}
      style={{
        maxWidth: "63.25rem",
        paddingRight: "60px",
      }}
      bodyStyle={{
        position: "relative",
        padding: "var(--s1)",
        backgroundColor: txResult ? "transparent" : "var(--bg-body)",
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
          <Button onClick={() => resetModal()}>
            <span>Go to Trusted Circle details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <Stack gap="s1">
          <ModalHeader>
            <Stack gap="s1">
              <Title>Do you really want to leave "{dsoName}"?</Title>
              <Text>When you leave, you can only come return when invited by a voting participant.</Text>
            </Stack>
            {!isSubmitting ? (
              <img alt="Close button" src={closeIcon} onClick={() => closeLeaveDsoModal(dsoDispatch)} />
            ) : null}
          </ModalHeader>
          <Separator />
          <ButtonGroup>
            <Button loading={isSubmitting} danger onClick={() => submitLeaveDso()}>
              Leave
            </Button>
            <Button disabled={isSubmitting} onClick={() => closeLeaveDsoModal(dsoDispatch)}>
              Cancel
            </Button>
          </ButtonGroup>
        </Stack>
      )}
    </StyledLeaveDsoModal>
  );
}
