import { Typography } from "antd";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { getDecodedAddress, getFormItemName } from "utils/forms";
import * as Yup from "yup";

import { ButtonGroup, Separator } from "./style";

const { Text } = Typography;

const dsoAddressLabel = "Trusted Circle address";

export interface FormDsoAddExistingValues {
  readonly dsoAddress: string;
}

interface FormDsoAddExistingProps {
  readonly addressPrefix: string;
  readonly handleSubmit: (values: FormDsoAddExistingValues) => void;
  readonly goToCreateDso: () => void;
}

export default function FormDsoAddExisting({
  addressPrefix,
  handleSubmit,
  goToCreateDso,
}: FormDsoAddExistingProps): JSX.Element {
  const validationSchema = Yup.object().shape({
    [getFormItemName(dsoAddressLabel)]: Yup.string()
      .typeError("Trusted Circle address must be alphanumeric")
      .required("Trusted Circle address is required")
      .test(`is-valid-bech32`, "Trusted Circle address is malformed", (address) => {
        const decodedAddress = getDecodedAddress(address);
        return !!decodedAddress;
      })
      .test(`has-valid-prefix`, `Trusted Circle address must start with ${addressPrefix}`, (address) => {
        const decodedAddress = getDecodedAddress(address);
        return decodedAddress?.prefix === addressPrefix;
      })
      .test(`has-valid-length`, `Trusted Circle address must have a data length of 20`, (address) => {
        const decodedAddress = getDecodedAddress(address);
        return decodedAddress?.data.length === 20;
      }),
  });

  return (
    <Formik
      initialValues={{
        [getFormItemName(dsoAddressLabel)]: "",
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit({ dsoAddress: values[getFormItemName(dsoAddressLabel)] })}
    >
      {({ submitForm, isValid }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field label={dsoAddressLabel} placeholder="Enter address" />
              <Separator />
              <ButtonGroup>
                <Text>
                  or <Text onClick={() => goToCreateDso()}>Create Trusted Circle</Text>
                </Text>
                <Button disabled={!isValid} onClick={() => submitForm()}>
                  <div>Enter</div>
                </Button>
              </ButtonGroup>
            </Stack>
          </Form>
        </>
      )}
    </Formik>
  );
}
