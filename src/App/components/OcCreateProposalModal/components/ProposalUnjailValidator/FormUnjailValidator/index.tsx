import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { config } from "config/network";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { getFormItemName, isValidAddress } from "utils/forms";
import * as Yup from "yup";

import { ButtonGroup, Separator } from "./style";

const validatorLabel = "Address of validator you want to unjail";
const commentLabel = "Comments (these comments are visible on the proposal once people vote on it)";

const validationSchema = Yup.object().shape({
  [getFormItemName(commentLabel)]: Yup.string().typeError("comment should be text").required(),
  [getFormItemName(validatorLabel)]: Yup.string()
    .typeError("Validator address must be alphanumeric")
    .required("Validator address is required")
    .test(
      "is-address-valid",
      "validator address must be valid",
      (validatorAddress) => !validatorAddress || isValidAddress(validatorAddress, config.addressPrefix),
    ),
});

export interface FormUnjailValidatorValues {
  readonly validator: string;
  readonly comment: string;
}

interface FormUnjailValidatorProps extends FormUnjailValidatorValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormUnjailValidatorValues) => void;
}

export default function FormUnjailValidator({
  comment,
  validator,
  goBack,
  handleSubmit,
}: FormUnjailValidatorProps): JSX.Element {
  const validatorLabel = "Address of validator you want to unjail";
  const commentLabel = "Comments (these comments are visible on the proposal once people vote on it)";

  return (
    <Formik
      initialValues={{
        [getFormItemName(validatorLabel)]: validator,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit({
          validator: values[getFormItemName(validatorLabel)],
          comment: values[getFormItemName(commentLabel)],
        });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field label={validatorLabel} placeholder="Enter address" />
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
