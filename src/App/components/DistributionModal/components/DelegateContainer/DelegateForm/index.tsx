import { Form } from "antd";
import Button from "App/components/Button";
import Field from "App/components/Field";
import { Formik } from "formik";
import { getFormItemName } from "utils/forms";

import { ButtonGroup, DelegateStack } from "./style";

export const defendantAddressLabel = "Delegated withdrawal to";

export interface FormDelegateValues {
  readonly delegatedAddress: string;
}

interface DelegateFormProps extends FormDelegateValues {
  readonly address: string;
  readonly delegateValidationSchema: any;
  readonly submitDelegate: (values: FormDelegateValues) => void;
}

export default function DelegateForm({
  address,
  delegatedAddress,
  delegateValidationSchema,
  submitDelegate,
}: DelegateFormProps): JSX.Element | null {
  return (
    <Formik
      initialValues={{ [getFormItemName(defendantAddressLabel)]: delegatedAddress }}
      enableReinitialize
      validationSchema={delegateValidationSchema}
      onSubmit={(values) =>
        submitDelegate({ delegatedAddress: values[getFormItemName(defendantAddressLabel)] })
      }
    >
      {({ submitForm, isValid, isSubmitting, setSubmitting, values }) => (
        <>
          <Form>
            <DelegateStack gap="s1">
              <Field label={defendantAddressLabel} placeholder="Enter delegated address" />
              <ButtonGroup>
                <Button
                  disabled={
                    !isValid ||
                    isSubmitting ||
                    delegatedAddress === values[getFormItemName(defendantAddressLabel)]
                  }
                  onClick={() => submitForm()}
                >
                  <div>Set delegate</div>
                </Button>
                <Button
                  disabled={isSubmitting || delegatedAddress === address}
                  type="ghost"
                  onClick={() => {
                    if (!address) return;

                    setSubmitting(true);
                    submitDelegate({ delegatedAddress: address });
                    setSubmitting(false);
                  }}
                >
                  <div>Clear delegate</div>
                </Button>
              </ButtonGroup>
            </DelegateStack>
          </Form>
        </>
      )}
    </Formik>
  );
}
