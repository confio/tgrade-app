import { Typography } from "antd";
import Button from "App/components/form/Button";
import { Field } from "App/components/form/Field";
import { TxResult } from "App/components/logic/ShowTxResult";
import { Formik } from "formik";
import { Form } from "formik-antd";
import * as React from "react";
import { useState } from "react";
import { addDso, closeAddDsoModal, useDso, useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { getDecodedAddress, getFormItemName } from "utils/forms";
import * as Yup from "yup";
import closeIcon from "../../assets/cross.svg";
import { ModalHeader, Separator } from "./style";

const { Title, Text } = Typography;

const dsoAddressLabel = "DSO address";

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
    sdkState: { config, signingClient },
  } = useSdk();
  const { dsoDispatch } = useDso();

  const [isSubmitting, setSubmitting] = useState(false);

  async function checkDsoAndStore({ dsoAddress }: AddExistingDsoFormValues) {
    setSubmitting(true);

    try {
      const response: any = await signingClient.queryContractSmart(dsoAddress, { dso: {} });
      const dsoName: string = response.name;
      addDso(dsoDispatch, [dsoAddress, dsoName]);

      setTxResult({ contractAddress: dsoAddress, msg: `Added DSO: ${dsoName} (${dsoAddress}).` });
    } catch (error) {
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    }

    setSubmitting(false);
  }

  const validationSchema = Yup.object().shape({
    [getFormItemName(dsoAddressLabel)]: Yup.string()
      .typeError("DSO address must be alphanumeric")
      .required("DSO address is required")
      .test(`is-valid-bech32`, "DSO address is malformed", (address) => {
        const decodedAddress = getDecodedAddress(address);
        return !!decodedAddress;
      })
      .test(`has-valid-prefix`, `DSO address must start with ${config.addressPrefix}`, (address) => {
        const decodedAddress = getDecodedAddress(address);
        return decodedAddress?.prefix === config.addressPrefix;
      })
      .test(`has-valid-length`, `DSO address must have a data length of 20`, (address) => {
        const decodedAddress = getDecodedAddress(address);
        return decodedAddress?.data.length === 20;
      }),
  });

  return (
    <>
      <ModalHeader>
        <Title>Have an existing DSO address</Title>
        {!isSubmitting ? (
          <img alt="Close button" src={closeIcon} onClick={() => closeAddDsoModal(dsoDispatch)} />
        ) : null}
      </ModalHeader>
      <Separator />
      <Formik
        initialValues={{
          [getFormItemName(dsoAddressLabel)]: "",
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => checkDsoAndStore({ dsoAddress: values[getFormItemName(dsoAddressLabel)] })}
      >
        {({ submitForm, isValid }) => (
          <>
            <Form>
              <Field label={dsoAddressLabel} placeholder="Enter address" />
              <Button disabled={!isValid} onClick={() => submitForm()}>
                <div>Enter</div>
              </Button>
            </Form>
          </>
        )}
      </Formik>
      <Separator />
      <Text onClick={() => goToCreateDso()}>or Create dso</Text>
    </>
  );
}
