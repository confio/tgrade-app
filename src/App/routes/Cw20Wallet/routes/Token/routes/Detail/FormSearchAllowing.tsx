import { Search } from "App/components/logic";
import { Formik } from "formik";
import { Form, FormItem } from "formik-antd";
import * as React from "react";
import { useSdk } from "service";
import { getSearchAddressValidationSchema } from "utils/formSchemas";

interface FormSearchAllowingProps {
  readonly initialAddress?: string;
  readonly setSearchedAddress: (value?: string) => Promise<void>;
}

export default function FormSearchAllowing({
  initialAddress,
  setSearchedAddress,
}: FormSearchAllowingProps): JSX.Element {
  const { getConfig } = useSdk();

  return (
    <Formik
      initialValues={{ address: initialAddress }}
      enableReinitialize
      validationSchema={getSearchAddressValidationSchema(getConfig().addressPrefix)}
      onSubmit={async ({ address }) => await setSearchedAddress(address || undefined)}
    >
      {(formikProps) => (
        <Form>
          <FormItem name="address">
            <Search
              name="address"
              placeholder="Search"
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
