import Button from "App/components/form/Button";
import { Field } from "App/components/form/Field";
import { Formik } from "formik";
import { Form } from "formik-antd";
import * as React from "react";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";
import { ButtonGroup, FormStack } from "./style";

const escrowLabel = "Escrow amount";

const validationSchema = Yup.object().shape({
  [getFormItemName(escrowLabel)]: Yup.number()
    .typeError("Escrow must be a number")
    .required("Escrow is required")
    .positive("Escrow must be positive"),
});

export interface FormDsoPaymentValues {
  readonly escrowAmount: string;
}

interface FormDsoPaymentProps {
  readonly handleSubmit: (values: FormDsoPaymentValues) => void;
  readonly goBack: () => void;
}

export default function FormDsoPayment({ handleSubmit, goBack }: FormDsoPaymentProps): JSX.Element {
  return (
    <Formik
      initialValues={{ [getFormItemName(escrowLabel)]: "" }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit({ escrowAmount: values[getFormItemName(escrowLabel)] })}
    >
      {({ dirty, isValid, isSubmitting, submitForm }) => (
        <Form>
          <FormStack>
            <Field disabled={isSubmitting} label={escrowLabel} placeholder="Enter escrow amount" />
            <ButtonGroup>
              <Button disabled={isSubmitting} onClick={() => goBack()}>
                <div>Back</div>
              </Button>
              <Button loading={isSubmitting} disabled={!dirty || !isValid} onClick={() => submitForm()}>
                <div>Sign transaction and pay escrow</div>
              </Button>
            </ButtonGroup>
          </FormStack>
        </Form>
      )}
    </Formik>
  );
}
