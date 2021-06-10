import { Typography } from "antd";
import Button from "App/components/form/Button";
import { Stack } from "App/components/layout";
import ShowTxResult, { TxResult } from "App/components/logic/ShowTxResult";
import { paths } from "App/paths";
import * as React from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { removeDso, useDso, useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { DsoHomeParams } from "../..";
import closeIcon from "./assets/cross.svg";
import modalBg from "./assets/modal-background.jpg";
import { ButtonGroup, ModalHeader, Separator, StyledModal } from "./style";

const { Title, Text } = Typography;

interface LeaveDsoModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
}

export default function LeaveDsoModal({ isModalOpen, closeModal }: LeaveDsoModalProps): JSX.Element {
  const history = useHistory();
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { signingClient, address },
  } = useSdk();
  const {
    dsoState: { dsos },
    dsoDispatch,
  } = useDso();
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  const [, dsoName = "DSO"] = dsos.find(([address]) => address === dsoAddress) ?? [];

  function resetModal() {
    closeModal();
    setTxResult(undefined);
    removeDso(dsoDispatch, dsoAddress);
    history.push(paths.dso.prefix);
  }

  async function submitLeaveDso() {
    setSubmitting(true);

    try {
      const { transactionHash } = await signingClient.execute(address, dsoAddress, { leave_dso: {} });

      setTxResult({
        msg: `Left ${dsoName} (${dsoAddress}). Transaction ID: ${transactionHash}`,
      });
    } catch (error) {
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <StyledModal
      centered
      footer={null}
      closable={false}
      visible={isModalOpen}
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
            <span>Go to DSO details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <Stack gap="s1">
          <ModalHeader>
            <Stack gap="s1">
              <Title>Do you really want to leave "{dsoName}"?</Title>
              <Text>When you leave, you can only come return when invited by a voting participant.</Text>
            </Stack>
            {!isSubmitting ? <img alt="Close button" src={closeIcon} onClick={() => closeModal()} /> : null}
          </ModalHeader>
          <Separator />
          <ButtonGroup>
            <Button loading={isSubmitting} danger onClick={() => submitLeaveDso()}>
              Leave
            </Button>
            <Button disabled={isSubmitting} onClick={() => closeModal()}>
              Cancel
            </Button>
          </ButtonGroup>
        </Stack>
      )}
    </StyledModal>
  );
}
