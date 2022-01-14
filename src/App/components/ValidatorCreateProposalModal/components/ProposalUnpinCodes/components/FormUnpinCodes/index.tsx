import CodeIdList from "App/components/AddressList";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useEffect, useState } from "react";
import { addressStringToArray, getFormItemName } from "utils/forms";
import * as Yup from "yup";

import { ButtonGroup, Separator } from "./style";

const codeIdsLabel = "Code IDs to be unpinned";
const commentLabel = "Comment";

const validationSchema = Yup.object().shape({
  [getFormItemName(codeIdsLabel)]: Yup.string()
    .typeError("Code IDs must be alphanumeric")
    .required("Code IDs are required"),
  [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
});

export interface FormUnpinCodesValues {
  readonly codeIds: readonly string[];
  readonly comment: string;
}

interface FormUnpinCodesProps extends FormUnpinCodesValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormUnpinCodesValues) => void;
}

export default function FormUnpinCodes({
  codeIds,
  comment,
  goBack,
  handleSubmit,
}: FormUnpinCodesProps): JSX.Element {
  const [codeIdsString, setCodeIdsString] = useState(codeIds.join(","));
  const [codeIdsArray, setCodeIdsArray] = useState(codeIds);

  useEffect(() => {
    const codeIdsArray = addressStringToArray(codeIdsString);
    setCodeIdsArray(codeIdsArray);
  }, [codeIdsString]);

  return (
    <Formik
      initialValues={{
        [getFormItemName(codeIdsLabel)]: codeIdsString,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const comment = values[getFormItemName(commentLabel)];
        handleSubmit({ codeIds: codeIdsArray, comment });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field
                label={codeIdsLabel}
                placeholder="Type or paste code IDs here"
                value={codeIdsString}
                onInputChange={({ target }) => {
                  setCodeIdsString(target.value);
                }}
              />
              <CodeIdList
                addresses={codeIdsArray}
                handleClose={(codeIdToRemove) =>
                  setCodeIdsArray(codeIdsArray.filter((codeId) => codeId !== codeIdToRemove))
                }
              />
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
