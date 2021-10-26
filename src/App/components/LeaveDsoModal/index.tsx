import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import Button from "App/components/Button";
import Stack from "App/components/Stack/style";
import { DsoHomeParams } from "App/pages/DsoHome";
import { paths } from "App/paths";
import { lazy, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getDsoName, removeDso, useDso, useError, useSdk } from "service";
import { closeLeaveDsoModal } from "service/dsos";
import { DsoContract } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";
import ShowTxResult, { TxResult } from "../ShowTxResult";
import StyledLeaveDsoModal, { ButtonGroup, ModalHeader, Separator } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));
const { Title, Text } = Typography;

export default function LeaveDsoModal(): JSX.Element {
  const history = useHistory();
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { config, signer, address, signingClient },
  } = useSdk();
  const {
    dsoState: { dsos, leaveDsoModalState },
    dsoDispatch,
  } = useDso();

  const [isModalOpen, setModalOpen] = useState(false);
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
      const dsoContract = new DsoContract(dsoAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.leaveDso(address);

      setTxResult({
        msg: `Left ${dsoName} (${dsoAddress}). Transaction ID: ${transactionHash}`,
      });
      removeDso(dsoDispatch, dsoAddress);
    } catch (error) {
      if (!(error instanceof Error)) return;
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
            <Button
              loading={isSubmitting}
              danger={!!signer}
              onClick={signer ? () => submitLeaveDso() : () => setModalOpen(true)}
            >
              {signer ? "Leave" : "Connect wallet"}
            </Button>
            <Button disabled={isSubmitting} onClick={() => closeLeaveDsoModal(dsoDispatch)}>
              Cancel
            </Button>
          </ButtonGroup>
        </Stack>
      )}
      <ConnectWalletModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </StyledLeaveDsoModal>
  );
}
