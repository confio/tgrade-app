import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useSdk } from "service";
import { getAmountField, getSendAddressValidationSchema } from "utils/formSchemas";
import * as Yup from "yup";
import { FormField } from "./style";

const { Text } = Typography;

export interface FormSendTokensFields {
  readonly amount: string;
  readonly address: string;
}

interface FormSendTokensProps {
  readonly tokenName: string;
  readonly maxAmount: Decimal;
  readonly sendTokensAction: (values: FormSendTokensFields) => void;
}

export default function FormSendTokens({
  tokenName,
  maxAmount,
  sendTokensAction,
}: FormSendTokensProps): JSX.Element {
  const { getConfig } = useSdk();

  const sendAmountValidationSchema = Yup.object().shape({
    amount: getAmountField().max(
      maxAmount.toFloatApproximation(),
      `Amount cannot be greater than ${maxAmount.toString()}`,
    ),
  });

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
          <Stack gap="s2">
            <Stack>
              <FormField>
                <Text>Send</Text>
                <FormItem name="amount">
                  <Input name="amount" placeholder="Enter amount" />
                </FormItem>
                <Text>{tokenName}</Text>
              </FormField>
              <FormField>
                <Text>to</Text>
                <FormItem name="address">
                  <Input name="address" placeholder="Enter address" />
                </FormItem>
              </FormField>
            </Stack>
            <Button
              type="primary"
              onClick={formikProps.submitForm}
              disabled={!(formikProps.isValid && formikProps.dirty)}
            >
              Send
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
