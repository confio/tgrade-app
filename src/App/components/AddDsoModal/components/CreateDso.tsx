import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { initialCreateDsoValues } from "App/components/AddDsoModal";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { Dispatch, SetStateAction, useState } from "react";
import { addDso, closeAddDsoModal, useDso, useError, useSdk } from "service";
import { gtagDsoAction } from "utils/analytics";
import { displayAmountToNative } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { TcContract } from "utils/trustedCircle";

import { ModalHeader, Separator } from "../style";
import FormDsoBasicData, { FormDsoBasicDataValues } from "./FormDsoBasicData";
import FormDsoMembers from "./FormDsoMembers";
import FormDsoPayment, { FormDsoPaymentValues } from "./FormDsoPayment";

const { Title } = Typography;
const { Step } = Steps;

enum CreateDsoSteps {
  BasicData = "BasicData",
  Members = "Members",
  Payment = "Payment",
}

interface CreateDsoProps {
  readonly setTxResult: (txResult: TxResult) => void;
  readonly goToAddExistingDso: () => void;
  readonly createDsoData: FormDsoBasicDataValues;
  readonly setCreateDsoData: Dispatch<SetStateAction<FormDsoBasicDataValues>>;
}

export default function CreateDso({
  setTxResult,
  goToAddExistingDso,
  createDsoData,
  setCreateDsoData,
}: CreateDsoProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, address, signingClient },
  } = useSdk();
  const { dsoDispatch } = useDso();

  const [addDsoStep, setAddDsoStep] = useState(CreateDsoSteps.BasicData);
  const [isSubmitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState<readonly string[]>([]);

  function handleSubmitBasicData({
    dsoName,
    votingDuration,
    quorum,
    threshold,
    allowEndEarly,
  }: FormDsoBasicDataValues) {
    setCreateDsoData({ dsoName, votingDuration, quorum, threshold, allowEndEarly });
    setAddDsoStep(CreateDsoSteps.Members);
  }

  async function handleSubmitPayment({ escrowAmount }: FormDsoPaymentValues) {
    gtagDsoAction("create_try");
    if (!signingClient || !address || !config.codeIds?.tgradeDso?.length) return;

    setSubmitting(true);

    try {
      const nativeEscrowAmount = displayAmountToNative(escrowAmount, config.coinMap, config.feeToken);

      const contractAddress = await TcContract.createTc(
        signingClient,
        config.codeIds?.tgradeDso[0],
        address,
        createDsoData.dsoName,
        nativeEscrowAmount,
        createDsoData.votingDuration,
        createDsoData.quorum,
        createDsoData.threshold,
        members,
        createDsoData.allowEndEarly,
        [{ denom: config.feeToken, amount: nativeEscrowAmount }],
        config.gasPrice,
      );

      addDso(dsoDispatch, contractAddress);
      setTxResult({
        contractAddress,
        msg: `You are the voting participant in ${createDsoData.dsoName} (${contractAddress}).`,
      });
      gtagDsoAction("create_success");
      setCreateDsoData(initialCreateDsoValues);
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack gap="s1">
      <ModalHeader>
        <Typography>
          <Title>Start Trusted Circle</Title>
        </Typography>
        <Steps size="small" current={Object.keys(CreateDsoSteps).indexOf(addDsoStep)}>
          {Object.keys(CreateDsoSteps).map((value) => (
            <Step key={value} />
          ))}
        </Steps>
        {!isSubmitting ? (
          <img alt="Close button" src={closeIcon} onClick={() => closeAddDsoModal(dsoDispatch)} />
        ) : null}
      </ModalHeader>
      <Separator />
      {addDsoStep === CreateDsoSteps.BasicData ? (
        <FormDsoBasicData
          handleSubmit={(values) => handleSubmitBasicData(values)}
          goToAddExistingDso={goToAddExistingDso}
          dsoName={createDsoData.dsoName}
          votingDuration={createDsoData.votingDuration}
          quorum={createDsoData.quorum}
          threshold={createDsoData.threshold}
          allowEndEarly={createDsoData.allowEndEarly}
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
    </Stack>
  );
}
