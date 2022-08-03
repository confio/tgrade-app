import Button from "App/components/Button";
import Field from "App/components/Field";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";

import { Separator, WithdrawStack } from "./style";

const reasonLabel = "Reason";

const validationSchema = Yup.object().shape({
  [getFormItemName(reasonLabel)]: Yup.string()
    .typeError("Reason must be text")
    .required("Reason is required")
    .min(10, "Reason length should be between 10 and 500 characters")
    .max(500, "Reason length should be between 10 and 500 characters"),
});

export interface FormWithdrawComplaintValues {
  readonly reason: string;
}

interface FormWithdrawComplaintProps extends FormWithdrawComplaintValues {
  readonly handleSubmit: (values: FormWithdrawComplaintValues) => void;
}

export default function FormWithdrawComplaint({
  reason,
  handleSubmit,
}: FormWithdrawComplaintProps): JSX.Element {
  return (
    <Formik
      initialValues={{
        [getFormItemName(reasonLabel)]: reason,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) =>
        handleSubmit({
          reason: values[getFormItemName(reasonLabel)],
        })
      }
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <WithdrawStack gap="s1">
              <Field label={reasonLabel} placeholder="Enter reason" textArea />
              <Separator />
              <Button disabled={!isValid} onClick={() => submitForm()}>
                <div>Withdraw complaint</div>
              </Button>
            </WithdrawStack>
          </Form>
        </>
      )}
    </Formik>
  );
}
