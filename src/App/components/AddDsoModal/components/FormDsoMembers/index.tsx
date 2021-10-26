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

const membersLabel = "Add member(s)";

const validationSchema = Yup.object().shape({
  [getFormItemName(membersLabel)]: Yup.string().typeError("Addresses must be alphanumeric"),
});

interface FormDsoMembersValues {
  readonly members: readonly string[];
}

interface FormDsoMembersProps extends FormDsoMembersValues {
  readonly goNext: () => void;
  readonly goBack: () => void;
  readonly setMembers: (members: readonly string[]) => void;
}

export default function FormDsoMembers({
  goNext,
  goBack,
  members,
  setMembers,
}: FormDsoMembersProps): JSX.Element {
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
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={() => {
        setMembers(membersArray);
        goNext();
      }}
    >
      {({ submitForm }) => (
        <>
          <Form>
            <Stack>
              <Field
                label={membersLabel}
                optional
                tooltip="You can add member(s) to your trusted circle by adding their addresses here. You can also add members later on"
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
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button
                  disabled={membersArray.some(
                    (memberAddress) => !isValidAddress(memberAddress, addressPrefix),
                  )}
                  onClick={() => {
                    submitForm();
                  }}
                >
                  <div>Next</div>
                </Button>
              </ButtonGroup>
            </Stack>
          </Form>
        </>
      )}
    </Formik>
  );
}
