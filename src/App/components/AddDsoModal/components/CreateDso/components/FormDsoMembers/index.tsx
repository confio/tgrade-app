import AddressList from "App/components/AddressList";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import * as React from "react";
import { useSdk } from "service";
import { getFormItemName, isValidAddress } from "utils/forms";
import * as Yup from "yup";
import BackButtonOrLink from "../../../../../BackButtonOrLink";
import { ButtonGroup, Separator } from "./style";

const membersLabel = "Participants";

const validationSchema = Yup.object().shape({
  [getFormItemName(membersLabel)]: Yup.string().typeError("Participants must be alphanumeric"),
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

  return (
    <Formik
      initialValues={{
        [getFormItemName(membersLabel)]: members.join(","),
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const membersString = values[getFormItemName(membersLabel)];
        const membersArray = membersString.split(/[\s,]+/);
        const nonEmptyOrDuplicateArray = [...new Set(membersArray.filter(Boolean))];
        setMembers(nonEmptyOrDuplicateArray);
      }}
    >
      {({ submitForm }) => (
        <>
          <Form>
            <Stack>
              <Field
                label={membersLabel}
                placeholder="Type or paste addresses here"
                value={members.join(",")}
                onInputChange={() => {
                  submitForm();
                }}
              />
              <AddressList
                short
                addresses={members}
                addressPrefix={addressPrefix}
                handleClose={(memberAddress) =>
                  setMembers(members.filter((member) => member !== memberAddress))
                }
              />
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button
                  disabled={members.some((memberAddress) => !isValidAddress(memberAddress, addressPrefix))}
                  onClick={() => goNext()}
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
