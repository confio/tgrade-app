import { Typography } from "antd";
import Button from "App/components/Button";
import Field from "App/components/Field";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useSdk } from "service";
import { Complaint } from "utils/arbiterPool";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";

import { Separator, WithdrawStack } from "./style";

const { Text } = Typography;

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
  readonly complaint: Complaint | undefined;
  readonly handleSubmit: (values: FormWithdrawComplaintValues) => void;
}

export default function FormWithdrawComplaint({
  complaint,
  reason,
  handleSubmit,
}: FormWithdrawComplaintProps): JSX.Element {
  const {
    sdkState: { address },
  } = useSdk();

  const complaintIsNotInitiatedOrWaiting = !complaint?.state.initiated || !complaint?.state.waiting;
  const userIsNotPlaintiff = !address || complaint?.plaintiff !== address;

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
              {complaintIsNotInitiatedOrWaiting ? (
                <Text style={{ color: "var(--color-error-form)" }}>
                  The complaint must be on state "initiated" or "waited" to be withdrawn
                </Text>
              ) : null}
              {userIsNotPlaintiff ? (
                <Text style={{ color: "var(--color-error-form)" }}>
                  The complaint can only be withdrawn by its plaintiff
                </Text>
              ) : null}
              <Field
                disabled={complaintIsNotInitiatedOrWaiting || userIsNotPlaintiff}
                label={reasonLabel}
                placeholder="Enter reason"
                textArea
              />
              <Separator />
              <Button
                disabled={!isValid || complaintIsNotInitiatedOrWaiting || userIsNotPlaintiff}
                onClick={() => submitForm()}
              >
                <div>Withdraw complaint</div>
              </Button>
            </WithdrawStack>
          </Form>
        </>
      )}
    </Formik>
  );
}
