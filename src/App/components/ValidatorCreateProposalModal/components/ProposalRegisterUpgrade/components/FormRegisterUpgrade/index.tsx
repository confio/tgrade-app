import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";

import { ButtonGroup, Separator } from "./style";

const nameLabel = "Name";
const heightLabel = "Upgrade at height";
const infoLabel = "Upgrade info";
const commentLabel = "Comment";

const validationSchema = Yup.object().shape({
  [getFormItemName(nameLabel)]: Yup.string()
    .typeError("Name must be alphanumeric")
    .required("Name is required"),
  [getFormItemName(heightLabel)]: Yup.number()
    .typeError("Height must be numeric")
    .required("Height is required")
    .positive("Height must be positive")
    .integer("Height must be an integer"),
  [getFormItemName(infoLabel)]: Yup.string()
    .typeError("Info must be alphanumeric")
    .required("Info is required"),
  [getFormItemName(commentLabel)]: Yup.string()
    .required("Comment is required")
    .typeError("Comment must be alphanumeric"),
});

export interface FormRegisterUpgradeValues {
  readonly name: string;
  readonly height: string;
  readonly info: string;
  readonly comment: string;
}

interface FormRegisterUpgradeProps extends FormRegisterUpgradeValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormRegisterUpgradeValues) => void;
}

export default function FormRegisterUpgrade({
  name,
  height,
  info,
  comment,
  goBack,
  handleSubmit,
}: FormRegisterUpgradeProps): JSX.Element {
  return (
    <Formik
      initialValues={{
        [getFormItemName(nameLabel)]: name,
        [getFormItemName(heightLabel)]: height,
        [getFormItemName(infoLabel)]: info,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit({
          name: values[getFormItemName(nameLabel)],
          height: values[getFormItemName(heightLabel)],
          info: values[getFormItemName(infoLabel)],
          comment: values[getFormItemName(commentLabel)],
        });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field label={nameLabel} placeholder="Enter name" />
              <Field label={heightLabel} placeholder="Enter height" />
              <Field label={infoLabel} placeholder="Enter info" />
              <Field label={commentLabel} placeholder="Enter comment" />
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button disabled={!isValid} onClick={() => submitForm()}>
                  <div>Create proposal</div>
                </Button>
              </ButtonGroup>
            </Stack>
          </Form>
        </>
      )}
    </Formik>
  );
}
