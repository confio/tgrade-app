import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { setAllowanceValidationSchema } from "utils/formSchemas";
import { FormAmount } from "./style";

const { Text } = Typography;

export interface FormChangeAmountFields {
  readonly newAmount: string;
}

interface FormChangeAmountProps {
  readonly tokenName: string;
  readonly submitChangeAmount: (values: FormChangeAmountFields) => void;
}

export default function FormChangeAmount({
  tokenName,
  submitChangeAmount,
}: FormChangeAmountProps): JSX.Element {
  return (
    <Formik
      initialValues={{ newAmount: "" }}
      onSubmit={submitChangeAmount}
      validationSchema={setAllowanceValidationSchema}
    >
      {(formikProps) => (
        <Form>
          <Stack gap="s7">
            <FormAmount>
              <FormItem name="newAmount">
                <Input name="newAmount" placeholder="Enter new amount" />
              </FormItem>
              <Text>{tokenName}</Text>
            </FormAmount>
            <Button
              type="primary"
              onClick={formikProps.submitForm}
              disabled={!(formikProps.isValid && formikProps.dirty)}
            >
              Edit
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
