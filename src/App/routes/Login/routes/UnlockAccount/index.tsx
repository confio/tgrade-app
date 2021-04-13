import { Button, Typography } from "antd";
import cosmWasmLogo from "App/assets/cosmWasmLogo.svg";
import { Stack } from "App/components/layout";
import { paths } from "App/paths";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useError, useSdk } from "service";
import { setInitialLayoutState, setLoading, useLayout } from "service/layout";
import { unlockWallet } from "utils/sdk";
import { runAfterLoad } from "utils/ui";
import * as Yup from "yup";
import { LightText, Logo } from "./style";

const { Title } = Typography;

interface FormUnlockAccountFields {
  readonly password: string;
}

export default function UnlockAccount(): JSX.Element {
  const { t } = useTranslation(["common", "login"]);

  const { layoutDispatch } = useLayout();
  useEffect(
    () =>
      setInitialLayoutState(layoutDispatch, {
        menuState: "hidden",
        backButtonProps: { path: paths.login.prefix },
      }),
    [layoutDispatch],
  );

  const { handleError } = useError();
  const sdk = useSdk();
  const config = sdk.getConfig();

  function submitUnlockForm({ password }: FormUnlockAccountFields) {
    setLoading(layoutDispatch, `${t("login:initializing")}`);

    runAfterLoad(async () => {
      try {
        const signer = await unlockWallet(config, password);
        sdk.init(signer);
      } catch (error) {
        handleError(error);
        setLoading(layoutDispatch, false);
      }
    });
  }

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required(t("form.password.required"))
      .min(4, t("form.password.minMax", { min: 4, max: 8 }))
      .max(8, t("form.password.minMax", { min: 4, max: 8 })),
  });

  return (
    <Stack gap="s4">
      <Logo src={cosmWasmLogo} alt="CosmWasm logo" />
      <Stack gap="s-1">
        <Title level={1}>{t("login:unlockAccount")}</Title>
        <LightText>{t("login:unlockAccountMsg")}</LightText>
      </Stack>
      <Formik
        initialValues={{ mnemonic: "", password: "" }}
        onSubmit={submitUnlockForm}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <Form>
            <Stack gap="s2">
              <FormItem name="password">
                <Input type="password" name="password" placeholder={t("login:password")} />
              </FormItem>
              <Button
                type="primary"
                onClick={formikProps.submitForm}
                disabled={!(formikProps.isValid && formikProps.dirty)}
              >
                {t("login:unlock")}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Stack>
  );
}
