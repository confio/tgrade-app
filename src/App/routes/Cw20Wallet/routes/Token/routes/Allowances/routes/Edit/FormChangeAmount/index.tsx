import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { getAmountField } from "utils/forms";
import * as Yup from "yup";
import { FormAmount } from "./style";

const { Text } = Typography;

export interface FormChangeAmountFields {
  readonly amount: string;
}

interface FormChangeAmountProps {
  readonly tokenName: string;
  readonly submitChangeAmount: (values: FormChangeAmountFields) => void;
}

export default function FormChangeAmount({
  tokenName,
  submitChangeAmount,
}: FormChangeAmountProps): JSX.Element {
  const { t } = useTranslation(["common", "cw20Wallet"]);

  const validationSchema = Yup.object().shape({
    amount: getAmountField(t),
  });

  return (
    <Formik initialValues={{ amount: "" }} onSubmit={submitChangeAmount} validationSchema={validationSchema}>
      {(formikProps) => (
        <Form>
          <Stack gap="s7">
            <FormAmount>
              <FormItem name="amount">
                <Input name="amount" placeholder={t("cw20Wallet:enterAmount")} />
              </FormItem>
              <Text>{tokenName}</Text>
            </FormAmount>
            <Button
              type="primary"
              onClick={formikProps.submitForm}
              disabled={!(formikProps.isValid && formikProps.dirty)}
            >
              {t("cw20Wallet:edit")}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
