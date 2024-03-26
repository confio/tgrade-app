import Button from "App/components/Button";
import Field from "App/components/Field";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { getFormItemName } from "utils/forms";
import { isValidUrl } from "utils/query";
import * as Yup from "yup";

import { RenderStack, Separator } from "./style";

const summaryLabel = "Summary";
const ipfsLinkLabel = "IPFS link";

export interface FormRenderDecisionValues {
  readonly summary: string;
  readonly ipfsLink: string;
}

interface FormRenderDecisionProps extends FormRenderDecisionValues {
  readonly handleSubmit: (values: FormRenderDecisionValues) => void;
}

export default function FormRenderDecision({
  summary,
  ipfsLink,
  handleSubmit,
}: FormRenderDecisionProps): JSX.Element {
  const validationSchema = Yup.object().shape({
    [getFormItemName(summaryLabel)]: Yup.string()
      .typeError("Summary must be text")
      .required("Summary is required")
      .min(10, "Summary length should be between 10 and 500 characters")
      .max(500, "Summary length should be between 10 and 500 characters"),
    [getFormItemName(ipfsLinkLabel)]: Yup.string()
      .typeError("IPFS link must be text")
      .required("IPFS link is required")
      .test("is-url-valid", "IPFS link must be a valid URL", (ipfsLink) => !ipfsLink || isValidUrl(ipfsLink)),
  });

  return (
    <Formik
      initialValues={{
        [getFormItemName(summaryLabel)]: summary,
        [getFormItemName(ipfsLinkLabel)]: ipfsLink,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) =>
        handleSubmit({
          summary: values[getFormItemName(summaryLabel)],
          ipfsLink: values[getFormItemName(ipfsLinkLabel)],
        })
      }
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <RenderStack gap="s1">
              <Field label={summaryLabel} placeholder="Enter summary" textArea />
              <Field label={ipfsLinkLabel} placeholder="Enter url" />
              <Separator />
              <Button disabled={!isValid} onClick={() => submitForm()}>
                <div>Render decision</div>
              </Button>
            </RenderStack>
          </Form>
        </>
      )}
    </Formik>
  );
}
