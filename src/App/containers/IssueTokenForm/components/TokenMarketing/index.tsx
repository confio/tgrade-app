import AddressTag from "App/components/AddressTag";
import Field from "App/components/Field";
import ModalButtons from "App/components/ModalButtons";
import ModalHeader from "App/components/ModalHeader";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { lazy, useState } from "react";
import { useSdk } from "service";
import { getFormItemName, isValidAddress } from "utils/forms";
import * as Yup from "yup";

import { FieldWrapper, FormStack, IssuerStack, IssuerText, Separator } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));
const { Step } = Steps;

export interface FormMarketingFields {
  readonly project?: string;
  readonly description?: string;
  readonly dsoAddress?: string;
}

const projectLabel = "Project";
const descriptionLabel = "Description";
const dsoAddressLabel = "Trusted Circle to associate with";

interface TokenMarketingProps {
  readonly closeModal: () => void;
  readonly handleSubmit: (values: FormMarketingFields) => void;
  readonly goBack: () => void;
}

export default function TokenMarketing({
  closeModal,
  handleSubmit,
  goBack,
}: TokenMarketingProps): JSX.Element {
  const {
    sdkState: { config, signer, address },
  } = useSdk();

  const [isModalOpen, setModalOpen] = useState(false);

  const validationSchema = Yup.object().shape({
    [getFormItemName(projectLabel)]: Yup.string().typeError("Project must be alphanumeric"),
    [getFormItemName(descriptionLabel)]: Yup.string().typeError("Description must be alphanumeric"),
    [getFormItemName(dsoAddressLabel)]: Yup.string()
      .typeError("Trusted Circle address must be alphanumeric")
      .test(
        "is-addresses-valid",
        "Trusted Circle address must be valid",
        (dsoAddress) => !dsoAddress || isValidAddress(dsoAddress, config.addressPrefix),
      ),
  });

  return (
    <>
      <Formik
        initialValues={{
          [getFormItemName(projectLabel)]: "",
          [getFormItemName(descriptionLabel)]: "",
          [getFormItemName(dsoAddressLabel)]: "",
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSubmit({
            project: values[getFormItemName(projectLabel)].toString(),
            description: values[getFormItemName(descriptionLabel)].toString(),
            dsoAddress: values[getFormItemName(dsoAddressLabel)].toString(),
          });
        }}
      >
        {({ isValid, submitForm, isSubmitting }) => {
          return (
            <Stack gap="s2">
              <ModalHeader title="Create digital asset" isSubmitting={isSubmitting} closeModal={closeModal}>
                <Steps size="small" current={1}>
                  <Step />
                  <Step />
                </Steps>
              </ModalHeader>
              <Separator />
              <Form>
                <FormStack gap="s1">
                  <IssuerStack>
                    <IssuerText>Issuer's account</IssuerText>
                    <AddressTag address={address || ""} />
                  </IssuerStack>
                  <FieldWrapper>
                    <Field label={projectLabel} placeholder="Enter project" optional />
                  </FieldWrapper>
                  <Field label={descriptionLabel} placeholder="Enter description" optional />
                  <FieldWrapper>
                    <Field label={dsoAddressLabel} placeholder="Enter address" optional />
                  </FieldWrapper>
                  <Separator />
                  <ModalButtons
                    buttonPrimary={{
                      text: signer ? "Create asset" : "Connect wallet",
                      disabled: !isValid,
                      onClick: signer ? submitForm : () => setModalOpen(true),
                    }}
                    backButton={{
                      text: "Back",
                      disabled: isSubmitting,
                      onClick: goBack,
                    }}
                    isLoading={isSubmitting}
                  />
                </FormStack>
              </Form>
            </Stack>
          );
        }}
      </Formik>
      <ConnectWalletModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </>
  );
}
