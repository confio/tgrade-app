import AddressList from "App/components/AddressList";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import { addressStringToArray, getFormItemName, isValidAddress } from "utils/forms";
import * as Yup from "yup";

import { ButtonGroup, Separator } from "./style";

const complaintIdLabel = "Complaint ID";
const membersLabel = "Members to be added";
const commentLabel = "Comment";

const validationSchema = Yup.object().shape({
  [getFormItemName(complaintIdLabel)]: Yup.number()
    .typeError("Complaint ID must be numeric")
    .required("Complaint ID is required"),
  [getFormItemName(membersLabel)]: Yup.string()
    .typeError("Addresses must be alphanumeric")
    .required("Participants are required"),
  [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
});

export interface FormProposeArbitersValues {
  readonly complaintId: string;
  readonly members: readonly string[];
  readonly comment: string;
}

interface FormProposeArbitersProps extends FormProposeArbitersValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormProposeArbitersValues) => void;
}

export default function FormProposeArbiters({
  complaintId,
  members,
  comment,
  goBack,
  handleSubmit,
}: FormProposeArbitersProps): JSX.Element {
  const {
    sdkState: {
      config: { addressPrefix },
    },
  } = useSdk();

  const [membersString, setMembersString] = useState(members.join(","));
  const [membersArray, setMembersArray] = useState(members);

  useEffect(() => {
    const membersArray = addressStringToArray(membersString);
    setMembersArray(membersArray);
  }, [membersString]);

  return (
    <Formik
      initialValues={{
        [getFormItemName(complaintIdLabel)]: complaintId,
        [getFormItemName(membersLabel)]: membersString,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const complaintId = values[getFormItemName(complaintIdLabel)];
        const comment = values[getFormItemName(commentLabel)];
        handleSubmit({ complaintId, members: membersArray, comment });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field label={complaintIdLabel} placeholder="Enter complaint ID" />
              <Field
                label={membersLabel}
                placeholder="Type or paste addresses here"
                value={membersString}
                onInputChange={({ target }) => {
                  setMembersString(target.value);
                }}
              />
              <AddressList
                short
                addresses={membersArray}
                addressPrefix={addressPrefix}
                handleClose={(memberAddress) =>
                  setMembersArray(membersArray.filter((member) => member !== memberAddress))
                }
              />
              <Field label={commentLabel} placeholder="Enter comment" optional />
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button
                  disabled={
                    !isValid ||
                    membersArray.some((memberAddress) => !isValidAddress(memberAddress, addressPrefix))
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
