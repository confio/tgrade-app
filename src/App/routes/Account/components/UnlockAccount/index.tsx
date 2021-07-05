import { Button } from "antd";
import { Stack } from "App/components/layoutPrimitives";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { LightText } from "./style";

export interface FormUnlockAccountFields {
  readonly password: string;
}

interface UnlockAccountProps {
  readonly submitUnlockAccount: (values: FormUnlockAccountFields) => void;
}

export default function UnlockAccount({ submitUnlockAccount }: UnlockAccountProps): JSX.Element {
  const { t } = useTranslation(["common", "account"]);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required(t("form.password.required"))
      .min(4, t("form.password.minMax", { min: 4, max: 8 }))
      .max(8, t("form.password.minMax", { min: 4, max: 8 })),
  });

  return (
    <Stack gap="s4">
      <LightText>{t("account:unlockMsg")}</LightText>
      <Formik
        initialValues={{ mnemonic: "", password: "" }}
        onSubmit={submitUnlockAccount}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <Form>
            <Stack gap="s2">
              <FormItem name="password">
                <Input type="password" name="password" placeholder={t("account:password")} />
              </FormItem>
              <Button
                type="primary"
                onClick={formikProps.submitForm}
                disabled={!(formikProps.isValid && formikProps.dirty)}
              >
                {t("account:unlock")}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Stack>
  );
}
