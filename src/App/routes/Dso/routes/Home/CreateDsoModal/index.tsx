import { Typography } from "antd";
import Button from "App/components/form/Button";
import * as React from "react";
import { useState } from "react";
import { useError, useSdk } from "service";
import { displayAmountToNative } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import closeIcon from "./assets/cross.svg";
import modalBg from "./assets/modal-background.jpg";
import FormDsoBasicData, { FormDsoBasicDataValues } from "./components/FormDsoBasicData";
import FormDsoMembers from "./components/FormDsoMembers";
import FormDsoPayment, { FormDsoPaymentValues } from "./components/FormDsoPayment";
import ShowTxResult, { TxResult } from "./components/ShowTxResult";
import { ModalHeader, Separator, StyledModal } from "./style";

const { Title } = Typography;

enum CreateDsoSteps {
  BasicData = "BasicData",
  Members = "Members",
  Payment = "Payment",
}

interface CreateDsoModalProps {
  readonly visible: boolean;
  readonly closeModal: () => void;
}

export default function CreateDsoModal({ visible, closeModal }: CreateDsoModalProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, address, signingClient },
  } = useSdk();

  const [createDsoStep, setCreateDsoStep] = useState(CreateDsoSteps.BasicData);
  const [isSubmitting, setSubmitting] = useState(false);

  const [dsoName, setDsoName] = useState("");
  const [votingDuration, setVotingDuration] = useState("");
  const [quorum, setQuorum] = useState("");
  const [threshold, setThreshold] = useState("");
  const [members, setMembers] = useState<readonly string[]>([]);
  const [txResult, setTxResult] = useState<TxResult>();

  function handleSubmitBasicData({ dsoName, votingDuration, quorum, threshold }: FormDsoBasicDataValues) {
    setDsoName(dsoName);
    setVotingDuration(votingDuration);
    setQuorum(quorum);
    setThreshold(threshold);
    setCreateDsoStep(CreateDsoSteps.Members);
  }

  async function handleSubmitPayment({ escrowAmount }: FormDsoPaymentValues) {
    if (!config.codeIds?.tgradeDso?.length) return;

    setSubmitting(true);

    const nativeEscrowAmount = displayAmountToNative(escrowAmount, config.coinMap, config.feeToken);

    const initMsg: any = {
      admin: address,
      name: dsoName,
      escrow_amount: nativeEscrowAmount,
      voting_period: parseInt(votingDuration, 10),
      quorum: (parseFloat(quorum) / 100).toString(),
      threshold: (parseFloat(threshold) / 100).toString(),
      initial_members: members,
    };

    try {
      const { contractAddress } = await signingClient.instantiate(
        address,
        config.codeIds?.tgradeDso[0],
        initMsg,
        dsoName,
        {
          admin: address,
          transferAmount: [{ denom: config.feeToken, amount: nativeEscrowAmount }],
        },
      );

      setTxResult({ msg: `You are the voting participant in ${dsoName} (${contractAddress}).` });
    } catch (error) {
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

  function tryAgain() {
    setCreateDsoStep(CreateDsoSteps.BasicData);
    setTxResult(undefined);
  }

  function clearModal() {
    closeModal();
    setCreateDsoStep(CreateDsoSteps.BasicData);
    setDsoName("");
    setVotingDuration("");
    setQuorum("");
    setThreshold("");
    setMembers([]);
    setTxResult(undefined);
  }

  return (
    <StyledModal
      centered
      footer={null}
      closable={false}
      visible={visible}
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
            <Button onClick={() => tryAgain()}>
              <span>Try again</span>
            </Button>
          ) : null}
          <Button onClick={() => clearModal()}>
            <span>Go to DSO details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <>
          <ModalHeader>
            <Title>Start DSO</Title>
            {!isSubmitting ? <img alt="Close button" src={closeIcon} onClick={() => closeModal()} /> : null}
          </ModalHeader>
          <Separator />
          {createDsoStep === CreateDsoSteps.BasicData ? (
            <FormDsoBasicData
              handleSubmit={(values) => handleSubmitBasicData(values)}
              dsoName={dsoName}
              votingDuration={votingDuration}
              quorum={quorum}
              threshold={threshold}
            />
          ) : createDsoStep === CreateDsoSteps.Members ? (
            <FormDsoMembers
              goNext={() => setCreateDsoStep(CreateDsoSteps.Payment)}
              goBack={() => setCreateDsoStep(CreateDsoSteps.BasicData)}
              members={members}
              setMembers={(members) => setMembers(members)}
            />
          ) : createDsoStep === CreateDsoSteps.Payment ? (
            <FormDsoPayment
              handleSubmit={(values) => handleSubmitPayment(values)}
              goBack={() => setCreateDsoStep(CreateDsoSteps.Members)}
            />
          ) : null}
        </>
      )}
    </StyledModal>
  );
}
