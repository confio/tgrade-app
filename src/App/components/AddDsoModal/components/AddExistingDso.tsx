import { Typography } from "antd";
import { Button, Field } from "App/components/form";
import { Stack } from "App/components/layoutPrimitives";
import { Formik } from "formik";
import { Form } from "formik-antd";
import * as React from "react";
import { useState } from "react";
import { addDso, closeAddDsoModal, useDso, useError, useSdk } from "service";
import { DsoContractQuerier } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";
import { getDecodedAddress, getFormItemName } from "utils/forms";
import * as Yup from "yup";
import { TxResult } from "../../logic/ShowTxResult";
import closeIcon from "../assets/cross.svg";
import { ButtonGroup, ModalHeader, Separator } from "../style";

const { Title, Text } = Typography;

const dsoAddressLabel = "Trusted Circle address";

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
    sdkState: { config, client, address },
  } = useSdk();
  const { dsoDispatch } = useDso();

  const [isSubmitting, setSubmitting] = useState(false);

  async function checkDsoAndStore({ dsoAddress }: AddExistingDsoFormValues) {
    if (!client) return;
    setSubmitting(true);

    try {
      const dsoContract = new DsoContractQuerier(dsoAddress, client);
      const { name: dsoName } = await dsoContract.getDso();
      addDso(dsoDispatch, dsoAddress);

      setTxResult({ contractAddress: dsoAddress, msg: `Added Trusted Circle: ${dsoName} (${dsoAddress}).` });
    } catch (error) {
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    }

    setSubmitting(false);
  }

  const validationSchema = Yup.object().shape({
    [getFormItemName(dsoAddressLabel)]: Yup.string()
      .typeError("Trusted Circle address must be alphanumeric")
      .required("Trusted Circle address is required")
      .test(`is-valid-bech32`, "Trusted Circle address is malformed", (address) => {
        const decodedAddress = getDecodedAddress(address);
        return !!decodedAddress;
      })
      .test(
        `has-valid-prefix`,
        `Trusted Circle address must start with ${config.addressPrefix}`,
        (address) => {
          const decodedAddress = getDecodedAddress(address);
          return decodedAddress?.prefix === config.addressPrefix;
        },
      )
      .test(`has-valid-length`, `Trusted Circle address must have a data length of 20`, (address) => {
        const decodedAddress = getDecodedAddress(address);
        return decodedAddress?.data.length === 20;
      }),
  });

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
              <Stack gap="s1">
                <Field label={dsoAddressLabel} placeholder="Enter address" />
                <Separator />
                <ButtonGroup>
                  {address ? (
                    <Text>
                      or <Text onClick={() => goToCreateDso()}>Create Trusted Circle</Text>
                    </Text>
                  ) : null}
                  <Button disabled={!isValid} onClick={() => submitForm()}>
                    <div>Enter</div>
                  </Button>
                </ButtonGroup>
              </Stack>
            </Form>
          </>
        )}
      </Formik>
    </Stack>
  );
}
