import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { getFormItemName, isJson } from "utils/forms";
import * as Yup from "yup";

import { ButtonGroup, Separator } from "./style";

const contractLabel = "Contract address";
const codeIdLabel = "Migrate to Code ID";
const migrateMsgLabel = "Migrate message";
const commentLabel = "Comment";

const validationSchema = Yup.object().shape({
  [getFormItemName(contractLabel)]: Yup.string()
    .typeError("Contract addres must be alphanumeric")
    .required("Contract address is required"),
  [getFormItemName(codeIdLabel)]: Yup.number()
    .typeError("Code ID must be numeric")
    .required("Code ID is required")
    .positive("Code ID must be positive")
    .integer("Code ID must be an integer"),
  [getFormItemName(migrateMsgLabel)]: Yup.string()
    .typeError("Migrate msg must be alphanumeric")
    .test(`is-valid-json`, "Migrate msg must be valid JSON", (msg) => !msg || isJson(msg)),
  [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
});

export interface FormMigrateContractValues {
  readonly contract: string;
  readonly codeId: string;
  readonly migrateMsg: string;
  readonly comment: string;
}

interface FormMigrateContractProps extends FormMigrateContractValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormMigrateContractValues) => void;
}

export default function FormMigrateContract({
  contract,
  codeId,
  migrateMsg,
  comment,
  goBack,
  handleSubmit,
}: FormMigrateContractProps): JSX.Element {
  return (
    <Formik
      initialValues={{
        [getFormItemName(contractLabel)]: contract,
        [getFormItemName(codeIdLabel)]: codeId,
        [getFormItemName(migrateMsgLabel)]: migrateMsg,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit({
          contract: values[getFormItemName(contractLabel)],
          codeId: values[getFormItemName(codeIdLabel)],
          migrateMsg: values[getFormItemName(migrateMsgLabel)],
          comment: values[getFormItemName(commentLabel)],
        });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field label={contractLabel} placeholder="Enter address" />
              <Field label={codeIdLabel} placeholder="Enter code ID" />
              <Field label={migrateMsgLabel} placeholder="Enter message" optional />
              <Field label={commentLabel} placeholder="Enter comment" optional />
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
