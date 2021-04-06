import { Button } from "antd";
import { Stack } from "App/components/layout";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { LightText } from "./style";

export interface FormLockAccountFields {
  readonly password: string;
  readonly repeatPassword: string;
}

interface LockAccountProps {
  readonly submitLockAccount: (values: FormLockAccountFields) => Promise<void>;
}

export default function LockAccount({ submitLockAccount }: LockAccountProps): JSX.Element {
  const { t } = useTranslation(["common", "account"]);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required(t("form.password.required"))
      .min(4, t("form.password.minMax", { min: 4, max: 8 }))
      .max(8, t("form.password.minMax", { min: 4, max: 8 })),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("form.password.match"))
      .required(t("form.password.required")),
  });

  return (
    <Stack gap="s4">
      <LightText>{t("account:lockMsg")}</LightText>
      <Formik
        initialValues={{ password: "", repeatPassword: "" }}
        onSubmit={submitLockAccount}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <Form>
            <Stack gap="s2">
              <FormItem name="password">
                <Input type="password" name="password" placeholder={t("account:password")} />
              </FormItem>
              <FormItem name="repeatPassword">
                <Input type="password" name="repeatPassword" placeholder={t("account:repeatPassword")} />
              </FormItem>
              <Button
                type="primary"
                onClick={formikProps.submitForm}
                disabled={!(formikProps.isValid && formikProps.dirty)}
              >
                {t("account:lock")}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Stack>
  );
}
