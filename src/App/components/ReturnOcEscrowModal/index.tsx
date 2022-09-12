import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import Button from "App/components/Button";
import ShowTxResult, { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import { lazy, useState } from "react";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { OcContract } from "utils/oversightCommunity";

import BackButtonOrLink from "../BackButtonOrLink";
import { ButtonGroup, ModalHeader, Separator, StyledModal } from "./style";

const ConnectWalletModal = lazy(() => import("../ConnectWalletModal"));
const { Title, Text } = Typography;

interface ReturnOcEscrowModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly requiredEscrow: string;
  readonly userEscrow: string;
  readonly exceedingEscrow: string;
  readonly refreshEscrows: () => Promise<void>;
}

export default function ReturnOcEscrowModal({
  isModalOpen,
  closeModal,
  requiredEscrow,
  userEscrow,
  exceedingEscrow,
  refreshEscrows,
}: ReturnOcEscrowModalProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, signer, address, signingClient },
  } = useSdk();
  const feeDenom = config.coinMap[config.feeToken].denom;

  const [isConnectWalletModalOpen, setConnectWalletModalOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  function resetModal() {
    closeModal();
    setTxResult(undefined);
    refreshEscrows();
  }

  async function submitReturnEscrow() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const ocContract = new OcContract(config, signingClient);
      const transactionHash = await ocContract.returnEscrow(address);

      setTxResult({
        msg: `Returned exceeding escrow for Oversight Community. Transaction ID: ${transactionHash}`,
      });
      refreshEscrows();
    } catch (error) {
      if (!(error instanceof Error)) return;
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
      destroyOnClose
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
          <Button onClick={() => resetModal()} data-cy="oc-escrow-modal-go-to-oc-details-button">
            <span>Go to Oversight Community details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <Stack gap="s1">
          <ModalHeader>
            <Stack gap="s1">
              <Title>Claim back your exceeding escrow for Oversight Community?</Title>
              <Text>
                Required escrow:{" "}
                <span data-cy="oc-claim-back-modal-required-escrow-value">{requiredEscrow}</span> {feeDenom}
              </Text>
              <Text>
                Your current escrow:{" "}
                <span data-cy="oc-claim-back-modal-your-current-escrow-value">{userEscrow}</span> {feeDenom}
              </Text>
              <Text>
                Exceeding escrow you can claim:{" "}
                <span data-cy="oc-claim-back-modal-you-can-claim-escrow-value">{exceedingEscrow}</span>{" "}
                {feeDenom}
              </Text>
            </Stack>
            {!isSubmitting ? <img alt="Close button" src={closeIcon} onClick={() => closeModal()} /> : null}
          </ModalHeader>
          <Separator />
          <ButtonGroup>
            <BackButtonOrLink text={"Back"} onClick={() => closeModal()} />
            <Button
              style={{ background: "var(--bg-button-1ary)", border: "none" }}
              loading={isSubmitting}
              danger={!!signer}
              onClick={signer ? () => submitReturnEscrow() : () => setConnectWalletModalOpen(true)}
              data-cy="oc-claim-back-modal-next-action-button"
            >
              {signer ? "Claim escrow" : "Connect wallet"}
            </Button>
          </ButtonGroup>
        </Stack>
      )}
      <ConnectWalletModal
        isModalOpen={isConnectWalletModalOpen}
        closeModal={() => setConnectWalletModalOpen(false)}
      />
    </StyledModal>
  );
}
