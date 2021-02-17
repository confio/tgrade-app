import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useSdk } from "service";
import { getAmountField, getSendAddressValidationSchema } from "utils/formSchemas";
import * as Yup from "yup";
import { FormField, FormStack } from "./style";

const { Text } = Typography;

export interface FormMintTokensFields {
  readonly amount: string;
  readonly address: string;
}

interface FormMintTokensProps {
  readonly tokenName: string;
  readonly maxAmount?: Decimal;
  readonly mintTokensAction: (values: FormMintTokensFields) => void;
}

export default function FormMintTokens({
  tokenName,
  maxAmount,
  mintTokensAction,
}: FormMintTokensProps): JSX.Element {
  const { getConfig } = useSdk();

  const mintAmountValidationSchema = Yup.object().shape({
    amount: maxAmount
      ? getAmountField().max(
          maxAmount.toFloatApproximation(),
          `Amount cannot be greater than ${maxAmount.toString()}`,
        )
      : getAmountField(),
  });

  const mintValidationSchema = mintAmountValidationSchema.concat(
    getSendAddressValidationSchema(getConfig().addressPrefix),
  );

  return (
    <Formik
      initialValues={{ amount: "", address: "" }}
      onSubmit={mintTokensAction}
      validationSchema={mintValidationSchema}
    >
      {(formikProps) => (
        <Form>
          <FormStack>
            <FormField>
              <Text>Mint</Text>
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
            <Button
              type="primary"
              onClick={formikProps.submitForm}
              disabled={!(formikProps.isValid && formikProps.dirty)}
            >
              Mint
            </Button>
          </FormStack>
        </Form>
      )}
    </Formik>
  );
}
