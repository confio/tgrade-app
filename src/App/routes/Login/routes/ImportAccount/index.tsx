import { Button, Typography } from "antd";
import cosmWasmLogo from "App/assets/cosmWasmLogo.svg";
import { Stack } from "App/components/layout";
import { paths } from "App/paths";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useError, useSdk } from "service";
import { useLayout } from "service/layout";
import { importWallet } from "utils/sdk";
import * as Yup from "yup";
import { LightText, Logo } from "./style";

const { Title } = Typography;
const { TextArea } = Input;

interface FormImportAccountFields {
  readonly mnemonic: string;
  readonly password: string;
}

export default function ImportAccount(): JSX.Element {
  const { t } = useTranslation(["common", "login"]);
  const backButtonProps = useMemo(() => ({ path: paths.login.prefix }), []);
  const { setLoading } = useLayout({ hideMenu: true, backButtonProps });

  const { handleError } = useError();
  const sdk = useSdk();
  const config = sdk.getConfig();

  async function submitImportAccount({ password, mnemonic }: FormImportAccountFields) {
    setLoading(`${t("login:initializing")}`);

    try {
      const signer = await importWallet(config, password, mnemonic);
      sdk.init(signer);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  }

  const validationSchema = Yup.object().shape({
    mnemonic: Yup.string().required(t("form.mnemonic.required")),
    password: Yup.string()
      .required(t("form.password.required"))
      .min(4, t("form.password.minMax", { min: 4, max: 8 }))
      .max(8, t("form.password.minMax", { min: 4, max: 8 })),
  });

  return (
    <Stack gap="s4">
      <Logo src={cosmWasmLogo} alt="CosmWasm logo" />
      <Stack gap="s-1">
        <Title level={1}>{t("login:importAccount")}</Title>
        <LightText>{t("login:importAccountMsg")}</LightText>
      </Stack>
      <Formik
        initialValues={{ mnemonic: "", password: "" }}
        onSubmit={submitImportAccount}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <Form>
            <Stack gap="s2">
              <FormItem name="mnemonic">
                <TextArea
                  name="mnemonic"
                  placeholder={t("login:securityWords")}
                  autoSize={{ minRows: 8, maxRows: 8 }}
                />
              </FormItem>
              <FormItem name="password">
                <Input type="password" name="password" placeholder={t("login:password")} />
              </FormItem>
              <Button
                type="primary"
                onClick={formikProps.submitForm}
                disabled={!(formikProps.isValid && formikProps.dirty)}
              >
                {t("login:import")}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Stack>
  );
}
