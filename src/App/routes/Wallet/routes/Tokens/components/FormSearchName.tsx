import { Search } from "App/components/logic";
import { Formik } from "formik";
import { Form, FormItem } from "formik-antd";
import * as React from "react";
import { useSdk } from "service";
import { getSearchAddressValidationSchema } from "utils/formSchemas";

interface FormSearchNameProps {
  readonly currentAddress: string;
  readonly setCurrentAddress: (value: React.SetStateAction<string>) => void;
}

export default function FormSearchName({
  currentAddress,
  setCurrentAddress,
}: FormSearchNameProps): JSX.Element {
  const { getConfig } = useSdk();

  return (
    <Formik
      initialValues={{ address: currentAddress }}
      validationSchema={getSearchAddressValidationSchema(getConfig().addressPrefix)}
      onSubmit={(values) => {
        setCurrentAddress(values.address);
      }}
    >
      {(formikProps) => (
        <Form>
          <FormItem name="address">
            <Search
              name="address"
              placeholder="Enter address"
              enterButton
              onSearch={formikProps.submitForm}
            />
          </FormItem>
        </Form>
      )}
    </Formik>
  );
}
