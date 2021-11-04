import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import { useState } from "react";
import { addDso, closeAddDsoModal, useDso, useError, useSdk } from "service";
import { DsoContractQuerier } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";
import { useOcAddress } from "utils/storage";

import { ModalHeader, Separator } from "../style";
import FormDsoAddExisting from "./FormDsoAddExisting";

const { Title } = Typography;

interface AddExistingDsoFormValues {
  readonly dsoAddress: string;
}

interface AddExistingDsoProps {
  readonly setTxResult: (txResult: TxResult) => void;
  readonly goToCreateDso: () => void;
}

export default function AddExistingDso({ setTxResult, goToCreateDso }: AddExistingDsoProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client },
  } = useSdk();
  const { dsoDispatch } = useDso();
  const [ocAddress] = useOcAddress();

  const [isSubmitting, setSubmitting] = useState(false);

  async function checkDsoAndStore({ dsoAddress }: AddExistingDsoFormValues) {
    if (!client) return;
    setSubmitting(true);

    try {
      if (dsoAddress === ocAddress) {
        throw new Error("Cannot add Oversight Committee as Trusted Circle");
      }

      const dsoContract = new DsoContractQuerier(dsoAddress, client);
      const { name: dsoName } = await dsoContract.getDso();
      addDso(dsoDispatch, dsoAddress);

      setTxResult({ contractAddress: dsoAddress, msg: `Added Trusted Circle: ${dsoName} (${dsoAddress}).` });
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    }

    setSubmitting(false);
  }

  return (
    <Stack gap="s1">
      <ModalHeader>
        <Typography>
          <Title>Have an existing Trusted Circle address?</Title>
        </Typography>
        {!isSubmitting ? (
          <img alt="Close button" src={closeIcon} onClick={() => closeAddDsoModal(dsoDispatch)} />
        ) : null}
      </ModalHeader>
      <Separator />
      <FormDsoAddExisting
        addressPrefix={config.addressPrefix}
        handleSubmit={checkDsoAndStore}
        goToCreateDso={goToCreateDso}
      />
    </Stack>
  );
}
