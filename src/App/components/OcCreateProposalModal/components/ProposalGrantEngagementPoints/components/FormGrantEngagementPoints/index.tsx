import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useSdk } from "service";
import { getFormItemName, isValidAddress } from "utils/forms";
import * as Yup from "yup";

import { ButtonGroup, Separator } from "./style";

const memberLabel = "Member to grant Engagements Points to";
const pointsLabel = "Number of Engagement Points";
const commentLabel = "Comment";

export interface FormGrantEngagementPointsValues {
  readonly member: string;
  readonly points: string;
  readonly comment: string;
}

interface FormGrantEngagementPointsProps extends FormGrantEngagementPointsValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormGrantEngagementPointsValues) => void;
}

export default function FormGrantEngagementPoints({
  member,
  comment,
  goBack,
  handleSubmit,
}: FormGrantEngagementPointsProps): JSX.Element {
  const {
    sdkState: { config },
  } = useSdk();

  const validationSchema = Yup.object().shape({
    [getFormItemName(memberLabel)]: Yup.string()
      .typeError("Address must be alphanumeric")
      .required("Member is required")
      .test(
        "is-address-valid",
        "Member address must be valid",
        (memberAddress) => !memberAddress || isValidAddress(memberAddress.trim(), config.addressPrefix),
      ),
    [getFormItemName(pointsLabel)]: Yup.number()
      .typeError("Engagement Points must be numeric")
      .required("Engagement Points are required"),
    [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
  });

  return (
    <Formik
      initialValues={{
        [getFormItemName(memberLabel)]: member,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) =>
        handleSubmit({
          member: values[getFormItemName(memberLabel)],
          points: values[getFormItemName(pointsLabel)],
          comment: values[getFormItemName(commentLabel)],
        })
      }
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field label={memberLabel} placeholder="Enter address" />
              <Field label={pointsLabel} placeholder="Enter points" />
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
