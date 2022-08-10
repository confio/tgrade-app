import { Form } from "antd";
import Button from "App/components/Button";
import Field from "App/components/Field";
import { Formik } from "formik";
import { getFormItemName } from "utils/forms";

import { ButtonGroup, DelegateStack } from "./style";

export const delegatedAddressLabel = "Delegated withdrawal to";

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
      initialValues={{ [getFormItemName(delegatedAddressLabel)]: delegatedAddress }}
      enableReinitialize
      validationSchema={delegateValidationSchema}
      onSubmit={(values) =>
        submitDelegate({ delegatedAddress: values[getFormItemName(delegatedAddressLabel)] })
      }
    >
      {({ submitForm, isValid, isSubmitting, setSubmitting, values }) => (
        <>
          <Form>
            <DelegateStack gap="s1">
              <Field label={delegatedAddressLabel} placeholder="Enter delegated address" />
              <ButtonGroup>
                <Button
                  disabled={
                    !isValid ||
                    isSubmitting ||
                    delegatedAddress === values[getFormItemName(delegatedAddressLabel)]
                  }
                  onClick={() => submitForm()}
                >
                  <div data-cy="engagement-withdraws-rewards-set-delegate-button">Set delegate</div>
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
