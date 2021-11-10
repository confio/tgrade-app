import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import Button from "App/components/Button";
import Stack from "App/components/Stack/style";
import { lazy, useState } from "react";
import { useError, useSdk } from "service";
import { closeLeaveOcModal, useOc } from "service/oversightCommunity";
import { DsoContract } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";

import ShowTxResult, { TxResult } from "../ShowTxResult";
import StyledLeaveOcModal, { ButtonGroup, ModalHeader, Separator } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));
const { Title, Text } = Typography;

export default function LeaveOcModal(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, signer, address, signingClient },
  } = useSdk();
  const {
    ocState: { ocAddress, leaveOcModalState },
    ocDispatch,
  } = useOc();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  function resetModal() {
    closeLeaveOcModal(ocDispatch);
    setTxResult(undefined);
  }

  async function submitLeaveOc() {
    if (!signingClient || !ocAddress || !address) return;
    setSubmitting(true);

    try {
      const dsoContract = new DsoContract(ocAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.leaveDso(address);

      setTxResult({
        msg: `Left Oversight Community (${ocAddress}). Transaction ID: ${transactionHash}`,
      });
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <StyledLeaveOcModal
      centered
      footer={null}
      closable={false}
      visible={leaveOcModalState === "open"}
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
        backgroundColor: txResult ? "transparent" : "var(--bg-body)",
      }}
      maskStyle={{ background: txResult ? "rgba(4,119,120,0.9)" : "rgba(4,119,120,0.6)" }}
    >
      {txResult ? (
        <ShowTxResult {...txResult}>
          {txResult.error ? (
            <Button onClick={() => setTxResult(undefined)}>
              <span>Try again</span>
            </Button>
          ) : null}
          <Button onClick={() => resetModal()}>
            <span>Go to Oversight Community details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <Stack gap="s1">
          <ModalHeader>
            <Stack gap="s1">
              <Title>Do you really want to leave the Oversight Community?</Title>
              <Text>When you leave, you can only come return when invited by a voting participant.</Text>
            </Stack>
            {!isSubmitting ? (
              <img alt="Close button" src={closeIcon} onClick={() => closeLeaveOcModal(ocDispatch)} />
            ) : null}
          </ModalHeader>
          <Separator />
          <ButtonGroup>
            <Button
              loading={isSubmitting}
              danger={!!signer}
              onClick={signer ? () => submitLeaveOc() : () => setModalOpen(true)}
            >
              {signer ? "Leave" : "Connect wallet"}
            </Button>
            <Button disabled={isSubmitting} onClick={() => closeLeaveOcModal(ocDispatch)}>
              Cancel
            </Button>
          </ButtonGroup>
        </Stack>
      )}
      <ConnectWalletModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </StyledLeaveOcModal>
  );
}
