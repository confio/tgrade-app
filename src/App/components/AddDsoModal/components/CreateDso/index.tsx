import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { useState } from "react";
import { addDso, closeAddDsoModal, useDso, useError, useSdk } from "service";
import { gtagDsoAction } from "utils/analytics";
import { displayAmountToNative } from "utils/currency";
import { DsoContract } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";
import { ModalHeader, Separator } from "../../style";
import FormDsoBasicData, { FormDsoBasicDataValues } from "../FormDsoBasicData";
import FormDsoMembers from "../FormDsoMembers";
import FormDsoPayment, { FormDsoPaymentValues } from "../FormDsoPayment";

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
  const [votingDuration, setVotingDuration] = useState("14");
  const [quorum, setQuorum] = useState("1");
  const [threshold, setThreshold] = useState("50.01");
  const [allowEndEarly, setAllowEndEarly] = useState(true);
  const [members, setMembers] = useState<readonly string[]>([]);

  function handleSubmitBasicData({
    dsoName,
    votingDuration,
    quorum,
    threshold,
    allowEndEarly,
  }: FormDsoBasicDataValues) {
    setDsoName(dsoName);
    setVotingDuration(votingDuration);
    setQuorum(quorum);
    setThreshold(threshold);
    setAllowEndEarly(allowEndEarly);
    setAddDsoStep(CreateDsoSteps.Members);
  }

  async function handleSubmitPayment({ escrowAmount }: FormDsoPaymentValues) {
    gtagDsoAction("create_try");
    if (!signingClient || !address || !config.codeIds?.tgradeDso?.length) return;

    setSubmitting(true);

    try {
      const nativeEscrowAmount = displayAmountToNative(escrowAmount, config.coinMap, config.feeToken);

      const contractAddress = await DsoContract.createDso(
        signingClient,
        config.codeIds?.tgradeDso[0],
        address,
        dsoName,
        nativeEscrowAmount,
        votingDuration,
        quorum,
        threshold,
        members,
        allowEndEarly,
        [{ denom: config.feeToken, amount: nativeEscrowAmount }],
        config.gasPrice,
      );

      addDso(dsoDispatch, contractAddress);
      setTxResult({
        contractAddress,
        msg: `You are the voting participant in ${dsoName} (${contractAddress}).`,
      });
      gtagDsoAction("create_success");
    } catch (error) {
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
          dsoName={dsoName}
          votingDuration={votingDuration}
          quorum={quorum}
          threshold={threshold}
          allowEndEarly={allowEndEarly}
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
