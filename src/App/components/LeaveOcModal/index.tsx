import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import Button from "App/components/Button";
import ConnectWalletModal from "App/components/ConnectWalletModal";
import Stack from "App/components/Stack/style";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { closeLeaveOcModal, useOc } from "service/oversightCommunity";
import { getErrorFromStackTrace } from "utils/errors";
import { MemberStatus, OcContract, OcContractQuerier } from "utils/oversightCommunity";

import ShowTxResult, { TxResult } from "../ShowTxResult";
import StyledLeaveOcModal, { ButtonGroup, ModalHeader, Separator } from "./style";

const { Title, Text } = Typography;

export default function LeaveOcModal(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, signer, address, client, signingClient },
  } = useSdk();
  const {
    ocState: { leaveOcModalState },
    ocDispatch,
  } = useOc();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  const [membership, setMembership] = useState<MemberStatus>();

  useEffect(() => {
    (async function queryMembership() {
      if (!client || !address) return;

      try {
        const dsoContract = new OcContractQuerier(config, client);
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
  }, [address, client, config, handleError]);

  function resetModal() {
    closeLeaveOcModal(ocDispatch);
    setTxResult(undefined);
  }

  async function submitLeaveOc() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const ocContract = new OcContract(config, signingClient);
      const transactionHash = await ocContract.leaveOc(address);

      setTxResult({
        msg: `Left Oversight Community. Transaction ID: ${transactionHash}`,
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
      destroyOnClose
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
          <Button onClick={() => resetModal()}>
            <span>Go to Oversight Community details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <Stack gap="s1">
          <ModalHeader>
            <Stack gap="s1">
              <Title>Leave Oversight Community</Title>
              {!membership ? <Text>You are not currently a member of the Oversight Community.</Text> : null}
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
                <Text>You are already in the process of leaving the Oversight Community.</Text>
              ) : null}
              {membership?.pending ? (
                <Text>You need to deposit the required escrow to gain voting rights.</Text>
              ) : null}
              {membership?.pending_paid ? <Text>You will become a voting member soon.</Text> : null}
            </Stack>
            {!isSubmitting ? (
              <img alt="Close button" src={closeIcon} onClick={() => closeLeaveOcModal(ocDispatch)} />
            ) : null}
          </ModalHeader>
          <Separator />
          <ButtonGroup>
            <Button
              disabled={!!membership?.leaving}
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
