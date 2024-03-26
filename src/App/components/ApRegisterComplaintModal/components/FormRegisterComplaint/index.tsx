import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useSdk } from "service";
import { getFormItemName, isValidAddress } from "utils/forms";
import * as Yup from "yup";

import { Separator } from "./style";

const titleLabel = "Title";
const descriptionLabel = "Description";
const defendantLabel = "Address of the defendant";

export interface FormRegisterComplaintValues {
  readonly title: string;
  readonly description: string;
  readonly defendant: string;
}

interface FormRegisterComplaintProps extends FormRegisterComplaintValues {
  readonly handleSubmit: (values: FormRegisterComplaintValues) => void;
}

export default function FormRegisterComplaint({
  title,
  description,
  defendant,
  handleSubmit,
}: FormRegisterComplaintProps): JSX.Element {
  const {
    sdkState: { config },
  } = useSdk();

  const validationSchema = Yup.object().shape({
    [getFormItemName(titleLabel)]: Yup.string()
      .typeError("Title should be text")
      .required("Title is required"),
    [getFormItemName(descriptionLabel)]: Yup.string()
      .typeError("Description should be text")
      .required("Description is required"),
    [getFormItemName(defendantLabel)]: Yup.string()
      .typeError("Defendant address must be alphanumeric")
      .required("Defendant address is required")
      .test(
        "is-address-valid",
        "Defendant address must be valid",
        (defendantAddress) => !defendantAddress || isValidAddress(defendantAddress, config.addressPrefix),
      ),
  });

  return (
    <Formik
      initialValues={{
        [getFormItemName(titleLabel)]: title,
        [getFormItemName(descriptionLabel)]: description,
        [getFormItemName(defendantLabel)]: defendant,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit({
          title: values[getFormItemName(titleLabel)],
          description: values[getFormItemName(descriptionLabel)],
          defendant: values[getFormItemName(defendantLabel)],
        });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field label={titleLabel} placeholder="Enter title" />
              <Field label={descriptionLabel} placeholder="Enter description" />
              <Field label={defendantLabel} placeholder="Enter address" />
              <Separator />
              <Button disabled={!isValid} onClick={() => submitForm()}>
                <div>Register complaint</div>
              </Button>
            </Stack>
          </Form>
        </>
      )}
    </Formik>
  );
}
