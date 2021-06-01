import { Tag } from "antd";
import Button from "App/components/form/Button";
import { Field } from "App/components/form/Field";
import { Formik } from "formik";
import { Form } from "formik-antd";
import * as React from "react";
import { useSdk } from "service";
import { getFormItemName } from "utils/forms";
import { isValidAddress } from "utils/sdk";
import { ellipsifyAddress } from "utils/ui";
import * as Yup from "yup";
import { ButtonGroup, FormStack } from "./style";

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
            <FormStack>
              <Field
                label={membersLabel}
                placeholder="Type or paste addresses here"
                onInputChange={() => submitForm()}
              />
              {members.length ? (
                <div>
                  {members.map((memberAddress, index) => (
                    <Tag
                      key={`${index}-${memberAddress}`}
                      color={isValidAddress(memberAddress, addressPrefix) ? "default" : "error"}
                      closable
                      onClose={() => setMembers(members.filter((member) => member !== memberAddress))}
                    >
                      {ellipsifyAddress(memberAddress)}
                    </Tag>
                  ))}
                </div>
              ) : null}
              <ButtonGroup>
                <Button onClick={() => goBack()}>
                  <div>Back</div>
                </Button>
                <Button
                  disabled={members.some((memberAddress) => !isValidAddress(memberAddress, addressPrefix))}
                  onClick={() => goNext()}
                >
                  <div>Next</div>
                </Button>
              </ButtonGroup>
            </FormStack>
          </Form>
        </>
      )}
    </Formik>
  );
}
