import Title from "antd/es/typography/Title";
import Button from "App/components/Button";
import Field from "App/components/Field";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { getDecodedAddress, getFormItemName } from "utils/forms";
import * as Yup from "yup";

import { defendantAddressLabel } from "../../../DistributionModal/components/DelegateContainer/DelegateForm";
import { ButtonGroup, FormStack, Separator } from "./style";

const titleLabel = "Title";
const descriptionLabel = "Description";
const defendantLabel = "Defendant";

export interface FormRegisterComplaintValues {
  readonly title: string;
  readonly description: string;
  readonly defendant: string;
}

interface FormRegisterComplaintProps extends FormRegisterComplaintValues {
  readonly goBack?: () => void;
  readonly handleSubmit: (values: FormRegisterComplaintValues) => void;
}

export default function FormRegisterComplaint({
  title,
  description,
  defendant,
  handleSubmit,
}: FormRegisterComplaintProps): JSX.Element {
  const validationSchema = Yup.object().shape({
    [getFormItemName(defendantAddressLabel)]: Yup.string()
      .typeError("Defendant address must be alphanumeric")
      .required("Defendant address is required")
      //TODO add more validations
      /*.test(
        "is-address-valid",
        "defendant address must be valid",
        (defendantAddress) => !defendantAddress || isValidAddress(defendantAddress, addressPrefix),
      ),*/
      .test(`is-valid-bech32`, "defendant address must be valid", (address) => {
        const decodedAddress = getDecodedAddress(address);
        return !!decodedAddress;
      }),
  });

  return (
    <Formik
      initialValues={{
        [getFormItemName(titleLabel)]: title,
        [getFormItemName(descriptionLabel)]: description,
        [getFormItemName(defendantLabel)]: defendantLabel,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) =>
        handleSubmit({
          title: values[getFormItemName(titleLabel)],
          description: values[getFormItemName(descriptionLabel)],
          defendant: values[getFormItemName(defendantLabel)],
        })
      }
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <FormStack gap="s1">
              <Field label={titleLabel} placeholder="Enter details of complains" />
              <Field label={descriptionLabel} placeholder="Enter details of complains" textArea />
              <Field label={defendantLabel} placeholder="Enter details of complains"></Field>
              <Separator />
              <ButtonGroup>
                {/*<BackButtonOrLink onClick={() => goBack()} text="Back" />*/}
                <Button disabled={!isValid} onClick={() => submitForm()}>
                  <div>Submit</div>
                </Button>
              </ButtonGroup>
            </FormStack>
          </Form>
        </>
      )}
    </Formik>
  );
}
