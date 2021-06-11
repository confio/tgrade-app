import Button from "App/components/form/Button";
import Checkbox from "App/components/form/Checkbox";
import { Field } from "App/components/form/Field";
import { BackButtonOrLink } from "App/components/logic";
import { Formik } from "formik";
import { Form } from "formik-antd";
import * as React from "react";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";
import { ButtonGroup, FieldGroup, FormStack, Separator } from "./style";

function getFormValuesWithType(values: { [x: string]: string | boolean }): FormEditDsoValues {
  return {
    dsoName: values[getFormItemName(dsoNameLabel)].toString(),
    quorum: values[getFormItemName(quorumLabel)].toString(),
    threshold: values[getFormItemName(thresholdLabel)].toString(),
    votingDuration: values[getFormItemName(votingDurationLabel)].toString(),
    escrowAmount: values[getFormItemName(escrowAmountLabel)].toString(),
    earlyPass: !!values[getFormItemName(earlyPassLabel)],
    comment: values[getFormItemName(commentLabel)].toString(),
  };
}

function checkEditParamsAreNew(
  formValues: FormEditDsoValues,
  currentValues: Omit<FormEditDsoValues, "comment">,
): boolean {
  return (
    formValues.dsoName !== currentValues.dsoName ||
    formValues.quorum !== currentValues.quorum ||
    formValues.threshold !== currentValues.threshold ||
    formValues.votingDuration !== currentValues.votingDuration ||
    formValues.escrowAmount !== currentValues.escrowAmount ||
    formValues.earlyPass !== currentValues.earlyPass
  );
}

const dsoNameLabel = "Add new name for the DSO";
const quorumLabel = "Quorum";
const thresholdLabel = "Threshold";
const votingDurationLabel = "Voting duration";
const escrowAmountLabel = "Escrow amount";
const earlyPassLabel = "Allow end early?";
const commentLabel = "Comment";

const validationSchema = Yup.object().shape({
  [getFormItemName(dsoNameLabel)]: Yup.string().typeError("DSO name must be alphanumeric"),
  [getFormItemName(quorumLabel)]: Yup.number()
    .typeError("Quorum must be a number")
    .positive("Quorum must be positive")
    .max(100, "Quorum must be 100 maximum"),
  [getFormItemName(thresholdLabel)]: Yup.number()
    .typeError("Threshold must be a number")
    .positive("Threshold must be positive")
    .max(100, "Threshold must be 100 maximum"),
  [getFormItemName(votingDurationLabel)]: Yup.number()
    .typeError("Voting duration must be a number")
    .positive("Voting duration must be positive"),
  [getFormItemName(escrowAmountLabel)]: Yup.number()
    .typeError("Voting duration must be a number")
    .positive("Voting duration must be positive"),
  [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
});

export interface FormEditDsoValues {
  readonly dsoName: string;
  readonly quorum: string;
  readonly threshold: string;
  readonly votingDuration: string;
  readonly escrowAmount: string;
  readonly earlyPass: boolean;
  readonly comment: string;
}

interface FormEditDsoProps extends FormEditDsoValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormEditDsoValues) => void;
  readonly currentDsoValues: Omit<FormEditDsoValues, "comment">;
}

export default function FormEditDso({
  goBack,
  handleSubmit,
  currentDsoValues,
  dsoName,
  quorum,
  threshold,
  votingDuration,
  escrowAmount,
  earlyPass,
  comment,
}: FormEditDsoProps): JSX.Element {
  return (
    <Formik
      initialValues={{
        [getFormItemName(dsoNameLabel)]: dsoName,
        [getFormItemName(quorumLabel)]: quorum,
        [getFormItemName(thresholdLabel)]: threshold,
        [getFormItemName(votingDurationLabel)]: votingDuration,
        [getFormItemName(escrowAmountLabel)]: escrowAmount,
        [getFormItemName(earlyPassLabel)]: earlyPass,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(getFormValuesWithType(values))}
    >
      {({ values, isValid, submitForm }) => (
        <>
          <Form>
            <FormStack gap="s1">
              <Field label={dsoNameLabel} placeholder="Enter DSO name" />
              <FieldGroup>
                <Field label={quorumLabel} placeholder="Enter quorum" units="%" />
                <Field label={thresholdLabel} placeholder="Enter threshold" units="%" />
              </FieldGroup>
              <FieldGroup>
                <Field label={votingDurationLabel} placeholder="Enter duration" units="Days" />
                <Field label={escrowAmountLabel} placeholder="Enter amount" units="TGD" />
              </FieldGroup>
              <Checkbox name={getFormItemName(earlyPassLabel)}>{earlyPassLabel}</Checkbox>
              <Field label={commentLabel} placeholder="Enter comment" />
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button
                  disabled={
                    !isValid || !checkEditParamsAreNew(getFormValuesWithType(values), currentDsoValues)
                  }
                  onClick={() => submitForm()}
                >
                  <div>Next</div>
                </Button>
              </ButtonGroup>
            </FormStack>
          </Form>
        </>
      )}
    </Formik>
  );
}
