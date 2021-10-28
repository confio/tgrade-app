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

const membersLabel = "Voting participants to be added";
const commentLabel = "Comment";

const validationSchema = Yup.object().shape({
  [getFormItemName(membersLabel)]: Yup.string()
    .typeError("Addresses must be alphanumeric")
    .required("Participants are required"),
  [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
});

export interface FormAddVotingParticipantsValues {
  readonly members: readonly string[];
  readonly comment: string;
}

interface FormAddVotingParticipantsProps extends FormAddVotingParticipantsValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormAddVotingParticipantsValues) => void;
}

export default function FormAddVotingParticipants({
  members,
  comment,
  goBack,
  handleSubmit,
}: FormAddVotingParticipantsProps): JSX.Element {
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
        [getFormItemName(membersLabel)]: membersString,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const comment = values[getFormItemName(commentLabel)];
        handleSubmit({ members: membersArray, comment });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
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
