import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import Button from "App/components/Button";
import Stack from "App/components/Stack/style";
import { DsoHomeParams } from "App/pages/DsoHome";
import { paths } from "App/paths";
import { lazy, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getDsoName, useDso, useError, useSdk } from "service";
import { closeLeaveDsoModal } from "service/dsos";
import { getErrorFromStackTrace } from "utils/errors";
import { MemberStatus, TcContract, TcContractQuerier } from "utils/trustedCircle";

import ShowTxResult, { TxResult } from "../ShowTxResult";
import StyledLeaveDsoModal, { ButtonGroup, ModalHeader, Separator } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));
const { Title, Text } = Typography;

export default function LeaveDsoModal(): JSX.Element | null {
  const history = useHistory();
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { config, signer, address, client, signingClient },
  } = useSdk();
  const {
    dsoState: { dsos, leaveDsoModalState },
    dsoDispatch,
  } = useDso();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();
  const [membership, setMembership] = useState<MemberStatus>();

  useEffect(() => {
    (async function queryMembership() {
      if (!client || !address || !dsoAddress) return;

      try {
        const dsoContract = new TcContractQuerier(dsoAddress, client);
        const escrowResponse = await dsoContract.getEscrow(address);

        if (escrowResponse) {
          setMembership(escrowResponse.status);
        } else {
          setMembership(undefined);
        }
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, client, dsoAddress, handleError]);

  if (!dsoAddress) return null;

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
      const dsoContract = new TcContract(dsoAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.leaveTc(address);

      setTxResult({
        msg: `Left ${dsoName} (${dsoAddress}). Transaction ID: ${transactionHash}`,
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
    <StyledLeaveDsoModal
      destroyOnClose
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
              <Title>Leave "{dsoName}"</Title>
              {!membership ? <Text>You are not currently a member of this Trusted Circle.</Text> : null}
              {membership?.non_voting ? (
                <Text>When you leave, you can only come return when invited by a voting participant.</Text>
              ) : null}
              {membership?.voting ? (
                <Text>
                  When you leave, you can only come return when invited by a voting participant. Your escrow
                  will also be frozen for some time.
                </Text>
              ) : null}
              {membership?.leaving ? (
                <Text>You are already in the process of leaving this Trusted Circle.</Text>
              ) : null}
              {membership?.pending ? (
                <Text>You need to deposit the required escrow to gain voting rights.</Text>
              ) : null}
              {membership?.pending_paid ? <Text>You will become a voting member soon.</Text> : null}
            </Stack>
            {!isSubmitting ? (
              <img alt="Close button" src={closeIcon} onClick={() => closeLeaveDsoModal(dsoDispatch)} />
            ) : null}
          </ModalHeader>
          <Separator />
          <ButtonGroup>
            <Button
              disabled={!!membership?.leaving}
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
