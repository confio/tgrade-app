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

const maxAgeNumBlocksLabel = "Maximum age of evidence (blocks)";
const maxAgeDurationLabel = "Maximum age of evidence (seconds)";
const maxBytesLabel = "Maximum bytes";
const commentLabel = "Comment";

const validationSchema = Yup.object().shape({
  [getFormItemName(maxAgeNumBlocksLabel)]: Yup.number().typeError("Max age in blocks must be numeric"),
  [getFormItemName(maxAgeDurationLabel)]: Yup.number().typeError("Max age in seconds must be numeric"),
  [getFormItemName(maxBytesLabel)]: Yup.number().typeError("Max bytes must be numeric"),
  [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
});

export interface FormUpdateConsensusEvidenceParamsValues {
  readonly maxAgeNumBlocks: string;
  readonly maxAgeDuration: string;
  readonly maxBytes: string;
  readonly comment: string;
}

interface FormUpdateConsensusEvidenceParamsProps extends FormUpdateConsensusEvidenceParamsValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormUpdateConsensusEvidenceParamsValues) => void;
}

export default function FormUpdateConsensusEvidenceParams({
  maxAgeNumBlocks,
  maxAgeDuration,
  maxBytes,
  comment,
  goBack,
  handleSubmit,
}: FormUpdateConsensusEvidenceParamsProps): JSX.Element {
  return (
    <Formik
      initialValues={{
        [getFormItemName(maxAgeNumBlocksLabel)]: maxAgeNumBlocks,
        [getFormItemName(maxAgeDurationLabel)]: maxAgeDuration,
        [getFormItemName(maxBytesLabel)]: maxBytes,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit({
          maxAgeNumBlocks: values[getFormItemName(maxAgeNumBlocksLabel)],
          maxAgeDuration: values[getFormItemName(maxAgeDurationLabel)],
          maxBytes: values[getFormItemName(maxBytesLabel)],
          comment: values[getFormItemName(commentLabel)],
        });
      }}
    >
      {({ isValid, values, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field label={maxAgeNumBlocksLabel} placeholder="Enter max blocks" optional />
              <Field label={maxAgeDurationLabel} placeholder="Enter max seconds" optional />
              <Field label={maxBytesLabel} placeholder="Enter max bytes" optional />
              <Field label={commentLabel} placeholder="Enter comment" optional />
              <Text>Blocks, seconds, or bytes need to be entered</Text>
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button
                  disabled={
                    !isValid ||
                    !(
                      values[getFormItemName(maxAgeNumBlocksLabel)] ||
                      values[getFormItemName(maxAgeDurationLabel)] ||
                      values[getFormItemName(maxBytesLabel)]
                    )
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
