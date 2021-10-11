import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Checkbox from "App/components/Checkbox";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";
import { ButtonGroup, FieldGroup, Separator, StyledTooltipWrapper, WarningText } from "./style";

const dsoNameLabel = "Trusted Circle name";
const votingDurationLabel = "Voting duration";
const quorumLabel = "Quorum";
const thresholdLabel = "Threshold";
const allowEndEarlyLabel = "Allow voting to end early?";

const validationSchema = Yup.object().shape({
  [getFormItemName(dsoNameLabel)]: Yup.string()
    .typeError("Trusted Circle name must be alphanumeric")
    .required("Trusted Circle name is required"),
  [getFormItemName(votingDurationLabel)]: Yup.number()
    .typeError("Voting duration must be a number")
    .required("Voting duration is required")
    .positive("Voting duration must be positive")
    .integer("Voting duration must be an integer")
    .min(1, "Voting duration must be 1 minimum"),
  [getFormItemName(quorumLabel)]: Yup.number()
    .typeError("Quorum must be a number")
    .required("Quorum is required")
    .positive("Quorum must be positive")
    .max(100, "Quorum must be 100 maximum"),
  [getFormItemName(thresholdLabel)]: Yup.number()
    .typeError("Threshold must be a number")
    .required("Threshold is required")
    .positive("Threshold must be positive")
    .min(50, "Threshold must be 50 minimum")
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
      {({ values, isValid, submitForm }) => {
        const votingDurationInt = parseInt(values[getFormItemName(votingDurationLabel)].toString(), 10);
        const showDurationWarning = votingDurationInt >= 60;

        return (
          <>
            <Form>
              <Stack gap="s1">
                <Field label={dsoNameLabel} placeholder="Enter Trusted Circle name" />
                <FieldGroup>
                  <Field label={votingDurationLabel} placeholder="Enter duration" units="Days" />
                  <Field
                    label={quorumLabel}
                    placeholder="Enter quorum"
                    tooltip="Percentage of voters needeed"
                    units="%"
                  />
                  <Field
                    label={thresholdLabel}
                    placeholder="Enter threshold"
                    tooltip="Percentage of favorable votes to pass"
                    units="%"
                  />
                </FieldGroup>
                <StyledTooltipWrapper title="Allows proposals to pass before the end of the voting duration. Requires that the threshold and quorum are met, measured against all eligible voters">
                  <Checkbox name={getFormItemName(allowEndEarlyLabel)}>{allowEndEarlyLabel}</Checkbox>
                </StyledTooltipWrapper>
                {showDurationWarning ? <WarningText>Warning: voting duration very long</WarningText> : null}
                <Separator />
                <ButtonGroup>
                  <BackButtonOrLink onClick={() => goToAddExistingDso()} text="Back" />
                  <Button disabled={!isValid} onClick={() => submitForm()}>
                    <div>Next</div>
                  </Button>
                </ButtonGroup>
              </Stack>
            </Form>
          </>
        );
      }}
    </Formik>
  );
}
