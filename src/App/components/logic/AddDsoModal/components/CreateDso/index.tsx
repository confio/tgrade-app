import { Typography } from "antd";
import * as React from "react";
import { useState } from "react";
import { addDso, closeAddDsoModal, useDso, useError, useSdk } from "service";
import { displayAmountToNative } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import closeIcon from "../../assets/cross.svg";
import { TxResult } from "../ShowTxResult";
import FormDsoBasicData, { FormDsoBasicDataValues } from "./components/FormDsoBasicData";
import FormDsoMembers from "./components/FormDsoMembers";
import FormDsoPayment, { FormDsoPaymentValues } from "./components/FormDsoPayment";
import { ModalHeader, Separator } from "./style";

const { Title } = Typography;

enum CreateDsoSteps {
  BasicData = "BasicData",
  Members = "Members",
  Payment = "Payment",
}

interface CreateDsoProps {
  readonly setTxResult: (txResult: TxResult) => void;
  readonly goToAddExistingDso: () => void;
}

export default function CreateDso({ setTxResult, goToAddExistingDso }: CreateDsoProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, address, signingClient },
  } = useSdk();
  const { dsoDispatch } = useDso();

  const [addDsoStep, setAddDsoStep] = useState(CreateDsoSteps.BasicData);
  const [isSubmitting, setSubmitting] = useState(false);

  const [dsoName, setDsoName] = useState("");
  const [votingDuration, setVotingDuration] = useState("");
  const [quorum, setQuorum] = useState("");
  const [threshold, setThreshold] = useState("");
  const [members, setMembers] = useState<readonly string[]>([]);

  function handleSubmitBasicData({ dsoName, votingDuration, quorum, threshold }: FormDsoBasicDataValues) {
    setDsoName(dsoName);
    setVotingDuration(votingDuration);
    setQuorum(quorum);
    setThreshold(threshold);
    setAddDsoStep(CreateDsoSteps.Members);
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

      addDso(dsoDispatch, [contractAddress, dsoName]);
      setTxResult({
        contractAddress,
        msg: `You are the voting participant in ${dsoName} (${contractAddress}).`,
      });
    } catch (error) {
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <ModalHeader>
        <Title>Start DSO</Title>
        {!isSubmitting ? (
          <img alt="Close button" src={closeIcon} onClick={() => closeAddDsoModal(dsoDispatch)} />
        ) : null}
      </ModalHeader>
      <Separator />
      {addDsoStep === CreateDsoSteps.BasicData ? (
        <FormDsoBasicData
          handleSubmit={(values) => handleSubmitBasicData(values)}
          goToAddExistingDso={goToAddExistingDso}
          dsoName={dsoName}
          votingDuration={votingDuration}
          quorum={quorum}
          threshold={threshold}
        />
      ) : addDsoStep === CreateDsoSteps.Members ? (
        <FormDsoMembers
          goNext={() => setAddDsoStep(CreateDsoSteps.Payment)}
          goBack={() => setAddDsoStep(CreateDsoSteps.BasicData)}
          members={members}
          setMembers={(members) => setMembers(members)}
        />
      ) : addDsoStep === CreateDsoSteps.Payment ? (
        <FormDsoPayment
          handleSubmit={(values) => handleSubmitPayment(values)}
          goBack={() => setAddDsoStep(CreateDsoSteps.Members)}
        />
      ) : null}
    </>
  );
}
