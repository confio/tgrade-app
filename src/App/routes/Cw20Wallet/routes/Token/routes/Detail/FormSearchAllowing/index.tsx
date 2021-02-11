import { Search } from "App/components/logic";
import { Formik } from "formik";
import { Form, FormItem } from "formik-antd";
import * as React from "react";
import { useSdk } from "service";
import { getSearchAddressValidationSchema } from "utils/formSchemas";

interface FormSearchAllowingProps {
  readonly initialAddress?: string;
  readonly setSearchedAddress: (value: string) => void;
}

export default function FormSearchAllowing({
  initialAddress,
  setSearchedAddress,
}: FormSearchAllowingProps): JSX.Element {
  const { getConfig } = useSdk();

  return (
    <Formik
      initialValues={{ address: initialAddress }}
      validationSchema={getSearchAddressValidationSchema(getConfig().addressPrefix)}
      onSubmit={(values) => {
        setSearchedAddress(values.address ?? "");
      }}
    >
      {(formikProps) => (
        <Form>
          <FormItem name="address">
            <Search
              name="address"
              placeholder="Search"
              enterButton
              onSearch={(value) => {
                formikProps.isValid && setSearchedAddress(value);
              }}
            />
          </FormItem>
        </Form>
      )}
    </Formik>
  );
}
