import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Field from "App/components/Field";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";

import { ButtonGroup, FormStack, Separator } from "./style";

const textLabel = "Text";

const validationSchema = Yup.object().shape({
  [getFormItemName(textLabel)]: Yup.string()
    .typeError("Text must be alphanumeric")
    .required("Text is required")
    .min(10, "Text length should be between 10 and 500 characters")
    .max(500, "Text length should be between 10 and 500 characters"),
});

export interface FormOpenTextValues {
  readonly text: string;
}

interface FormOpenTextProps extends FormOpenTextValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormOpenTextValues) => void;
}

export default function FormOpenText({ text, goBack, handleSubmit }: FormOpenTextProps): JSX.Element {
  return (
    <Formik
      initialValues={{
        [getFormItemName(textLabel)]: text,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) =>
        handleSubmit({
          text: values[getFormItemName(textLabel)],
        })
      }
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <FormStack gap="s1">
              <Field label={textLabel} placeholder="Enter proposal text" textArea />
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button disabled={!isValid} onClick={() => submitForm()}>
                  <div>Create proposal</div>
                </Button>
              </ButtonGroup>
            </FormStack>
          </Form>
        </>
      )}
    </Formik>
  );
}
