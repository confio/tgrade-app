import { Typography } from "antd";
import Button from "App/components/Button";
import Field from "App/components/Field";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useSdk } from "service";
import { Complaint } from "utils/arbiterPool";
import { getFormItemName } from "utils/forms";
import { isValidUrl } from "utils/query";
import * as Yup from "yup";

import { RenderStack, Separator } from "./style";

const { Text } = Typography;

const summaryLabel = "Summary";
const ipfsLinkLabel = "IPFS link";

export interface FormRenderDecisionValues {
  readonly summary: string;
  readonly ipfsLink: string;
}

interface FormRenderDecisionProps extends FormRenderDecisionValues {
  readonly complaint: Complaint | undefined;
  readonly handleSubmit: (values: FormRenderDecisionValues) => void;
}

export default function FormRenderDecision({
  summary,
  ipfsLink,
  complaint,
  handleSubmit,
}: FormRenderDecisionProps): JSX.Element {
  const {
    sdkState: { address },
  } = useSdk();

  const complaintIsNotProcessing = !complaint?.state.processing;
  const isNotArbiters = !address || complaint?.state.processing?.arbiters !== address;

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
              {complaintIsNotProcessing ? (
                <Text style={{ color: "var(--color-error-form)" }}>
                  The complaint must be on state "processing" for the decision to be rendered
                </Text>
              ) : null}
              {isNotArbiters ? (
                <Text style={{ color: "var(--color-error-form)" }}>
                  A decision can only be rendered by its arbiters
                </Text>
              ) : null}
              <Field
                disabled={complaintIsNotProcessing || isNotArbiters}
                label={summaryLabel}
                placeholder="Enter summary"
                textArea
              />
              <Field
                disabled={complaintIsNotProcessing || isNotArbiters}
                label={ipfsLinkLabel}
                placeholder="Enter url"
              />
              <Separator />
              <Button
                disabled={!isValid || complaintIsNotProcessing || isNotArbiters}
                onClick={() => submitForm()}
              >
                <div>Render decision</div>
              </Button>
            </RenderStack>
          </Form>
        </>
      )}
    </Formik>
  );
}
