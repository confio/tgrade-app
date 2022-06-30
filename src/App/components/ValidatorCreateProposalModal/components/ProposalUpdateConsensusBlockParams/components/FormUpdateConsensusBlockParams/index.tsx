import { Typography } from "antd";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";

import { ButtonGroup, Separator } from "./style";

const { Text } = Typography;

const maxBytesLabel = "Maximum bytes";
const maxGasLabel = "Maximum gas";
const commentLabel = "Comment";

const validationSchema = Yup.object().shape({
  [getFormItemName(maxBytesLabel)]: Yup.number().typeError("Max bytes must be numeric"),
  [getFormItemName(maxGasLabel)]: Yup.number().typeError("Max gas must be numeric"),
  [getFormItemName(commentLabel)]: Yup.string()
    .required("Comment is required")
    .typeError("Comment must be alphanumeric"),
});

export interface FormUpdateConsensusBlockParamsValues {
  readonly maxBytes: string;
  readonly maxGas: string;
  readonly comment: string;
}

interface FormUpdateConsensusBlockParamsProps extends FormUpdateConsensusBlockParamsValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormUpdateConsensusBlockParamsValues) => void;
}

export default function FormUpdateConsensusBlockParams({
  maxBytes,
  maxGas,
  comment,
  goBack,
  handleSubmit,
}: FormUpdateConsensusBlockParamsProps): JSX.Element {
  return (
    <Formik
      initialValues={{
        [getFormItemName(maxBytesLabel)]: maxBytes,
        [getFormItemName(maxGasLabel)]: maxGas,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit({
          maxBytes: values[getFormItemName(maxBytesLabel)],
          maxGas: values[getFormItemName(maxGasLabel)],
          comment: values[getFormItemName(commentLabel)],
        });
      }}
    >
      {({ isValid, values, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field label={maxBytesLabel} placeholder="Enter max bytes" optional />
              <Field label={maxGasLabel} placeholder="Enter max gas" optional />
              <Field label={commentLabel} placeholder="Enter comment" />
              <Text>Bytes or gas need to be entered</Text>
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button
                  disabled={
                    !isValid ||
                    !(values[getFormItemName(maxBytesLabel)] || values[getFormItemName(maxGasLabel)])
                  }
                  onClick={() => submitForm()}
                >
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
