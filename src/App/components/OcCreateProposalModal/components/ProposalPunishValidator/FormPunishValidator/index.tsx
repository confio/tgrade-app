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

const validatorsLabel = "Addresses of validators you want to punish";
const commentLabel = "Comment";

const validationSchema = Yup.object().shape({
  [getFormItemName(validatorsLabel)]: Yup.string()
    .typeError("Addresses must be alphanumeric")
    .required("Participants are required"),
  [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
});

export interface FormAddParticipantsValues {
  readonly validators: readonly string[];
  readonly comment: string;
}

interface FormAddParticipantsProps extends FormAddParticipantsValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormAddParticipantsValues) => void;
}

export default function FormAddParticipants({
  validators,
  comment,
  goBack,
  handleSubmit,
}: FormAddParticipantsProps): JSX.Element {
  const {
    sdkState: {
      config: { addressPrefix },
    },
  } = useSdk();

  const [membersString, setMembersString] = useState(validators.join(","));
  const [membersArray, setMembersArray] = useState(validators);

  useEffect(() => {
    const membersArray = addressStringToArray(membersString);
    setMembersArray(membersArray);
  }, [membersString]);

  return (
    <Formik
      initialValues={{
        [getFormItemName(validatorsLabel)]: membersString,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const comment = values[getFormItemName(commentLabel)];
        handleSubmit({ validators: membersArray, comment });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field
                label={validatorsLabel}
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
