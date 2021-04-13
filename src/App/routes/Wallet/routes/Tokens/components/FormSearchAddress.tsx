import { Search } from "App/components/logic";
import { Formik } from "formik";
import { Form, FormItem } from "formik-antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSdk } from "service";
import { getAddressField } from "utils/forms";
import * as Yup from "yup";

interface FormSearchNameProps {
  readonly currentAddress: string;
  readonly setCurrentAddress: (value: React.SetStateAction<string>) => void;
}

export default function FormSearchAddress({
  currentAddress,
  setCurrentAddress,
}: FormSearchNameProps): JSX.Element {
  const { t } = useTranslation(["common", "wallet"]);
  const {
    sdkState: { config },
  } = useSdk();

  const validationSchema = Yup.object().shape({
    address: getAddressField(t, config.addressPrefix, true),
  });

  return (
    <Formik
      initialValues={{ address: currentAddress }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setCurrentAddress(values.address);
      }}
    >
      {(formikProps) => (
        <Form>
          <FormItem name="address">
            <Search
              aria-label="search-input"
              name="address"
              placeholder={t("wallet:enterAddress")}
              enterButton
              onSearch={formikProps.submitForm}
            />
          </FormItem>
        </Form>
      )}
    </Formik>
  );
}
