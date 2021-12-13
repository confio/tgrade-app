import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import Button from "App/components/Button";
import ShowTxResult, { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import { DsoHomeParams } from "App/pages/DsoHome";
import { lazy, useState } from "react";
import { useParams } from "react-router-dom";
import { getDsoName, useDso, useError, useSdk } from "service";
import { DsoContract } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";

import BackButtonOrLink from "../BackButtonOrLink";
import { ButtonGroup, ModalHeader, Separator, StyledModal } from "./style";

const ConnectWalletModal = lazy(() => import("../ConnectWalletModal"));
const { Title, Text } = Typography;

interface ReturnDsoEscrowModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly requiredEscrow: string;
  readonly userEscrow: string;
  readonly exceedingEscrow: string;
  readonly refreshEscrows: () => Promise<void>;
}

export default function ReturnDsoEscrowModal({
  isModalOpen,
  closeModal,
  requiredEscrow,
  userEscrow,
  exceedingEscrow,
  refreshEscrows,
}: ReturnDsoEscrowModalProps): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { config, signer, address, signingClient },
  } = useSdk();
  const feeDenom = config.coinMap[config.feeToken].denom;
  const {
    dsoState: { dsos },
  } = useDso();

  const [isConnectWalletModalOpen, setConnectWalletModalOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [txResult, setTxResult] = useState<TxResult>();

  const dsoName = getDsoName(dsos, dsoAddress);

  function resetModal() {
    closeModal();
    setTxResult(undefined);
    refreshEscrows();
  }

  async function submitReturnEscrow() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const dsoContract = new DsoContract(dsoAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.returnEscrow(address);

      setTxResult({
        msg: `Returned exceeding escrow for ${dsoName} (${dsoAddress}). Transaction ID: ${transactionHash}`,
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
              <Title>Claim back your exceeding escrow for "{dsoName}"?</Title>
              <Text>
                Required escrow: {requiredEscrow} {feeDenom}
              </Text>
              <Text>
                Your current escrow: {userEscrow} {feeDenom}
              </Text>
              <Text>
                Exceeding escrow you can claim: {exceedingEscrow} {feeDenom}
              </Text>
            </Stack>
            {!isSubmitting ? <img alt="Close button" src={closeIcon} onClick={() => closeModal()} /> : null}
          </ModalHeader>
          <Separator />
          <ButtonGroup>
            <BackButtonOrLink text={"Back"} onClick={() => closeModal()} />
            <Button
              style={{ backgroundColor: "#0BB0B1", border: "none" }}
              loading={isSubmitting}
              danger={!!signer}
              onClick={signer ? () => submitReturnEscrow() : () => setConnectWalletModalOpen(true)}
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
