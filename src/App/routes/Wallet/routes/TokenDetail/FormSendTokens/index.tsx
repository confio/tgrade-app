import { Button } from "antd";
import { Formik } from "formik";
import { Form, Input } from "formik-antd";
import React from "react";
import { useSdk } from "service";
import { getSendAddressValidationSchema } from "utils/formSchemas";
import * as Yup from "yup";
import { FormField, FormItemAddress, FormItemAmount, FormStack, FormText, FormTextToken } from "./style";

export interface FormSendTokensValues {
  readonly amount: string;
  readonly address: string;
}

interface FormSendTokensProps {
  readonly tokenName: string;
  readonly tokenAmount: string;
  readonly sendTokensAction: (values: FormSendTokensValues) => void;
}

export function FormSendTokens({
  tokenName,
  tokenAmount,
  sendTokensAction,
}: FormSendTokensProps): JSX.Element {
  const sendAmountValidationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("An amount is required")
      .positive("Amount should be positive")
      .max(parseFloat(tokenAmount), `Amount cannot be greater than ${tokenAmount}`),
  });

  const { getConfig } = useSdk();
  const sendValidationSchema = sendAmountValidationSchema.concat(
    getSendAddressValidationSchema(getConfig().addressPrefix),
  );

  return (
    <Formik
      initialValues={{ amount: "", address: "" }}
      onSubmit={sendTokensAction}
      validationSchema={sendValidationSchema}
    >
      {(formikProps) => (
        <Form>
          <FormStack>
            <FormField>
              <FormText>Send</FormText>
              <FormItemAmount name="amount">
                <Input name="amount" placeholder="Enter amount" />
              </FormItemAmount>
              <FormTextToken>{tokenName}</FormTextToken>
            </FormField>
            <FormField>
              <FormText>To</FormText>
              <FormItemAddress name="address">
                <Input name="address" placeholder="Enter address" />
              </FormItemAddress>
            </FormField>
            <Button
              type="primary"
              onClick={formikProps.submitForm}
              disabled={!(formikProps.isValid && formikProps.dirty)}
            >
              Send
            </Button>
          </FormStack>
        </Form>
      )}
    </Formik>
  );
}
