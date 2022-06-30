import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";

import { ButtonGroup, Separator } from "./style";

const commentLabel = "Comment";

const validationSchema = Yup.object().shape({
  [getFormItemName(commentLabel)]: Yup.string()
    .required("Comment is required")
    .typeError("Comment must be alphanumeric"),
});

export interface FormCancelUpgradeValues {
  readonly comment: string;
}

interface FormCancelUpgradeProps extends FormCancelUpgradeValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormCancelUpgradeValues) => void;
}

export default function FormCancelUpgrade({
  comment,
  goBack,
  handleSubmit,
}: FormCancelUpgradeProps): JSX.Element {
  return (
    <Formik
      initialValues={{
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit({ comment: values[getFormItemName(commentLabel)] })}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
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
