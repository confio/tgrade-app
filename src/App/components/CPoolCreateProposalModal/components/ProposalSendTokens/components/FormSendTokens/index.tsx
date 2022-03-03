import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";

import { ButtonGroup, Separator } from "./style";

const receiverLabel = "Address to send tokens to";
const tokensAmountLabel = "Amount of tokens";
const commentLabel = "Comment";

const validationSchema = Yup.object().shape({
  [getFormItemName(receiverLabel)]: Yup.string()
    .typeError("Address must be alphanumeric")
    .required("Member is required"),
  [getFormItemName(tokensAmountLabel)]: Yup.number()
    .typeError("Tokens must be numeric")
    .required("Tokens are required")
    .positive("Tokens must be positive"),
  [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
});

export interface FormSendTokensValues {
  readonly receiver: string;
  readonly tokensAmount: string;
  readonly comment: string;
}

interface FormSendTokensProps extends FormSendTokensValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormSendTokensValues) => void;
}

export default function FormSendTokens({
  receiver,
  tokensAmount,
  comment,
  goBack,
  handleSubmit,
}: FormSendTokensProps): JSX.Element {
  return (
    <Formik
      initialValues={{
        [getFormItemName(receiverLabel)]: receiver,
        [getFormItemName(tokensAmountLabel)]: tokensAmount,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) =>
        handleSubmit({
          receiver: values[getFormItemName(receiverLabel)],
          tokensAmount: values[getFormItemName(tokensAmountLabel)],
          comment: values[getFormItemName(commentLabel)],
        })
      }
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field label={receiverLabel} placeholder="Enter address" />
              <Field label={tokensAmountLabel} placeholder="Enter tokens" />
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
