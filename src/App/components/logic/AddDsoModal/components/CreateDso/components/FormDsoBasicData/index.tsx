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

const dsoNameLabel = "DSO name";
const votingDurationLabel = "Voting duration";
const quorumLabel = "Quorum";
const thresholdLabel = "Threshold";
const allowEndEarlyLabel = "Allow end early?";

const validationSchema = Yup.object().shape({
  [getFormItemName(dsoNameLabel)]: Yup.string()
    .typeError("DSO name must be alphanumeric")
    .required("DSO name is required"),
  [getFormItemName(votingDurationLabel)]: Yup.number()
    .typeError("Voting duration must be a number")
    .required("Voting duration is required")
    .positive("Voting duration must be positive"),
  [getFormItemName(quorumLabel)]: Yup.number()
    .typeError("Quorum must be a number")
    .required("Quorum is required")
    .positive("Quorum must be positive")
    .max(100, "Quorum must be 100 maximum"),
  [getFormItemName(thresholdLabel)]: Yup.number()
    .typeError("Threshold must be a number")
    .required("Threshold is required")
    .positive("Threshold must be positive")
    .max(100, "Threshold must be 100 maximum"),
});

export interface FormDsoBasicDataValues {
  readonly dsoName: string;
  readonly votingDuration: string;
  readonly quorum: string;
  readonly threshold: string;
  readonly allowEndEarly: boolean;
}

interface FormDsoBasicDataProps extends FormDsoBasicDataValues {
  readonly handleSubmit: (values: FormDsoBasicDataValues) => void;
  readonly goToAddExistingDso: () => void;
}

export default function FormDsoBasicData({
  handleSubmit,
  goToAddExistingDso,
  dsoName,
  votingDuration,
  quorum,
  threshold,
  allowEndEarly,
}: FormDsoBasicDataProps): JSX.Element {
  return (
    <Formik
      initialValues={{
        [getFormItemName(dsoNameLabel)]: dsoName,
        [getFormItemName(votingDurationLabel)]: votingDuration,
        [getFormItemName(quorumLabel)]: quorum,
        [getFormItemName(thresholdLabel)]: threshold,
        [getFormItemName(allowEndEarlyLabel)]: allowEndEarly,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) =>
        handleSubmit({
          dsoName: values[getFormItemName(dsoNameLabel)].toString(),
          votingDuration: values[getFormItemName(votingDurationLabel)].toString(),
          quorum: values[getFormItemName(quorumLabel)].toString(),
          threshold: values[getFormItemName(thresholdLabel)].toString(),
          allowEndEarly: !!values[getFormItemName(allowEndEarlyLabel)],
        })
      }
    >
      {({ dirty, isValid, submitForm }) => (
        <>
          <Form>
            <FormStack gap="s1">
              <Field label={dsoNameLabel} placeholder="Enter DSO name" />
              <FieldGroup>
                <Field label={votingDurationLabel} placeholder="Enter duration" units="Days" />
                <Field label={quorumLabel} placeholder="Enter quorum" units="%" />
                <Field label={thresholdLabel} placeholder="Enter threshold" units="%" />
              </FieldGroup>
              <Checkbox name={getFormItemName(allowEndEarlyLabel)}>{allowEndEarlyLabel}</Checkbox>
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goToAddExistingDso()} text="Back" />
                <Button disabled={!isValid} onClick={() => submitForm()}>
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
