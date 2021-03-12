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
  const { t } = useTranslation(["common", "wallet"]);
  const { getConfig } = useSdk();

  const validationSchema = Yup.object().shape({
    amount: !maxAmount
      ? getAmountField(t)
      : getAmountField(t, maxAmount.toFloatApproximation(), maxAmount.toString()),
    address: getAddressField(t, getConfig().addressPrefix),
  });

  return (
    <Formik
      initialValues={{ amount: "", address: "" }}
      onSubmit={mintTokensAction}
      validationSchema={validationSchema}
    >
      {(formikProps) => (
        <Form>
          <Stack gap="s2">
            <Stack>
              <FormField>
                <Text>{t("cw20Wallet:mint")}</Text>
                <FormItem name="amount">
                  <Input name="amount" placeholder={t("cw20Wallet:enterAmount")} />
                </FormItem>
                <Text>{tokenName}</Text>
              </FormField>
              <FormField>
                <Text>{t("cw20Wallet:to")}</Text>
                <FormItem name="address">
                  <Input name="address" placeholder={t("cw20Wallet:enterAddress")} />
                </FormItem>
              </FormField>
            </Stack>
            <Button
              type="primary"
              onClick={formikProps.submitForm}
              disabled={!(formikProps.isValid && formikProps.dirty)}
            >
              {t("cw20Wallet:mint")}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
