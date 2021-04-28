import { Decimal } from "@cosmjs/math";
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
  readonly denomToDisplay: string;
  readonly decimalBalance: Decimal;
  readonly sendTokens: (values: FormSendTokensValues) => void;
}

export default function FormSendTokens({
  denomToDisplay,
  decimalBalance,
  sendTokens,
}: FormSendTokensProps): JSX.Element {
  const { t } = useTranslation(["common", "wallet"]);
  const {
    sdkState: { config },
  } = useSdk();

  const validationSchema = Yup.object().shape({
    amount: getAmountField(t, decimalBalance.toFloatApproximation(), decimalBalance.toString()),
    address: getAddressField(t, config.addressPrefix),
  });

  return (
    <Formik
      initialValues={{ amount: "", address: "" }}
      onSubmit={sendTokens}
      validationSchema={validationSchema}
    >
      {(formikProps) => (
        <Form>
          <Stack>
            <FormField>
              <Text id="amount-label">{t("wallet:send")}</Text>
              <FormItem name="amount">
                <Input aria-labelledby="amount-label" name="amount" placeholder={t("wallet:enterAmount")} />
              </FormItem>
              <Text>{denomToDisplay}</Text>
            </FormField>
            <FormField>
              <Text id="address-label">{t("wallet:to")}</Text>
              <FormItem name="address">
                <Input
                  aria-labelledby="address-label"
                  name="address"
                  placeholder={t("wallet:enterAddress")}
                />
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
