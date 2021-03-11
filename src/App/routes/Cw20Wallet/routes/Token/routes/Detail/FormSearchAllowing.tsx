import { Search } from "App/components/logic";
import { Formik } from "formik";
import { Form, FormItem } from "formik-antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSdk } from "service";
import { getAddressField } from "utils/forms";
import * as Yup from "yup";

interface FormSearchAllowingProps {
  readonly initialAddress?: string;
  readonly setSearchedAddress: (value?: string) => Promise<void>;
}

export default function FormSearchAllowing({
  initialAddress,
  setSearchedAddress,
}: FormSearchAllowingProps): JSX.Element {
  const { t } = useTranslation(["common", "cw20Wallet"]);
  const { getConfig } = useSdk();

  const validationSchema = Yup.object().shape({
    address: getAddressField(t, getConfig().addressPrefix),
  });

  return (
    <Formik
      initialValues={{ address: initialAddress }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async ({ address }) => await setSearchedAddress(address || undefined)}
    >
      {(formikProps) => (
        <Form>
          <FormItem name="address">
            <Search
              name="address"
              placeholder={t("cw20Wallet:search")}
              enterButton
              onSearch={async (address) => {
                if (formikProps.isValid) await setSearchedAddress(address || undefined);
              }}
            />
          </FormItem>
        </Form>
      )}
    </Formik>
  );
}
