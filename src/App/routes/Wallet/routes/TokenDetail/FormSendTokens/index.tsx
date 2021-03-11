import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSdk } from "service";
import { getAddressField, getAmountField } from "utils/forms";
import * as Yup from "yup";
import { FormField } from "./style";

const { Text } = Typography;

export interface FormSendTokensValues {
  readonly amount: string;
  readonly address: string;
}

interface FormSendTokensProps {
  readonly tokenName: string;
  readonly maxAmount: string;
  readonly sendTokensAction: (values: FormSendTokensValues) => Promise<void>;
}

export default function FormSendTokens({
  tokenName,
  maxAmount,
  sendTokensAction,
}: FormSendTokensProps): JSX.Element {
  const { t } = useTranslation(["common", "wallet"]);
  const { getConfig } = useSdk();

  const validationSchema = Yup.object().shape({
    amount: getAmountField(t, parseFloat(maxAmount), maxAmount),
    address: getAddressField(t, getConfig().addressPrefix),
  });

  return (
    <Formik
      initialValues={{ amount: "", address: "" }}
      onSubmit={sendTokensAction}
      validationSchema={validationSchema}
    >
      {(formikProps) => (
        <Form>
          <Stack>
            <FormField>
              <Text>{t("wallet:send")}</Text>
              <FormItem name="amount">
                <Input name="amount" placeholder={t("wallet:enterAmount")} />
              </FormItem>
              <Text>{tokenName}</Text>
            </FormField>
            <FormField>
              <Text>{t("wallet:to")}</Text>
              <FormItem name="address">
                <Input name="address" placeholder={t("wallet:enterAddress")} />
              </FormItem>
            </FormField>
            <Button
              type="primary"
              onClick={formikProps.submitForm}
              disabled={!(formikProps.isValid && formikProps.dirty)}
            >
              {t("wallet:send")}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
