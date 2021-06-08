import { AddressList } from "App/components/form/AddressList";
import Button from "App/components/form/Button";
import { Field } from "App/components/form/Field";
import { Stack } from "App/components/layout";
import { BackButtonOrLink } from "App/components/logic";
import { Formik } from "formik";
import { Form } from "formik-antd";
import * as React from "react";
import { useSdk } from "service";
import { addressStringToArray, getFormItemName, isValidAddress } from "utils/forms";
import * as Yup from "yup";
import { ButtonGroup, Separator } from "./style";

const membersLabel = "Non voting participants to be removed";
const commentLabel = "Comment";

export interface FormRemoveParticipantsValues {
  readonly members: readonly string[];
  readonly comment: string;
}

interface FormRemoveParticipantsProps extends FormRemoveParticipantsValues {
  readonly setMembers: React.Dispatch<React.SetStateAction<readonly string[]>>;
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormRemoveParticipantsValues) => void;
}

export default function FormRemoveParticipants({
  members,
  setMembers,
  comment,
  goBack,
  handleSubmit,
}: FormRemoveParticipantsProps): JSX.Element {
  const {
    sdkState: {
      config: { addressPrefix },
    },
  } = useSdk();

  const validationSchema = Yup.object().shape({
    [getFormItemName(membersLabel)]: Yup.string()
      .typeError("Participants must be alphanumeric")
      .required("Participants are required")
      .test("are-addresses-valid", "Participants must have valid addresses", (membersString) => {
        const membersArray = addressStringToArray(membersString || "");
        return membersArray.every((memberAddress) => isValidAddress(memberAddress, addressPrefix));
      }),
    [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
  });

  return (
    <Formik
      initialValues={{
        [getFormItemName(membersLabel)]: members.join(","),
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const members = addressStringToArray(values[getFormItemName(membersLabel)]);
        const comment = values[getFormItemName(commentLabel)];
        handleSubmit({ members, comment });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field
                label={membersLabel}
                placeholder="Type or paste addresses here"
                value={members.join(",")}
                onInputChange={({ target: { value: membersString } }) => {
                  const membersArray = addressStringToArray(membersString);
                  setMembers(membersArray);
                }}
              />
              <AddressList
                addresses={members}
                addressPrefix={addressPrefix}
                handleClose={(memberAddress) =>
                  setMembers(members.filter((member) => member !== memberAddress))
                }
              />
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
