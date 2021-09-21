import Field from "App/components/Field";
import FieldsTokenLogo from "App/components/FieldsTokenLogo";
import FieldsTokenMint, { MintType } from "App/components/FieldsTokenMint";
import FieldsTokenSupply from "App/components/FieldsTokenSupply";
import ModalButtons from "App/components/ModalButtons";
import ModalHeader from "App/components/ModalHeader";
import Stack from "App/components/Stack/style";
import Steps from "App/components/Steps";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useState } from "react";
import { EmbeddedLogoType } from "utils/cw20";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";
import { FormStack, NameWrapper, Separator } from "./style";

const { Step } = Steps;

export interface FormTokenSpecsFields {
  readonly tokenSymbol: string;
  readonly tokenName: string;
  readonly initialSupply: string;
  readonly decimals: string;
  readonly mint: string;
  readonly mintCap?: string;
}

const tokenSymbolLabel = "Token symbol";
const tokenNameLabel = "Token name";
const logoUrlLabel = "URL of the logo SVG image";
const logoFileLabel = "Upload Logo (SVG)";
const initialSupplyLabel = "Initial supply";
const decimalsLabel = "Set decimal places";
const mintLabel = "Mint";
const mintCapLabel = "Mint cap";

const validationSchema = Yup.object().shape({
  [getFormItemName(tokenSymbolLabel)]: Yup.string()
    .typeError("Token symbol must be alphanumeric")
    .required("Token symbol is required")
    .min(3, "Token symbol must have between 3 and 12 characters")
    .max(12, "Token symbol must have between 3 and 12 characters")
    .matches(/^[a-zA-Z-]{3,12}$/, 'Token symbol must use a-z, A-Z, or "-" characters'),
  [getFormItemName(tokenNameLabel)]: Yup.string()
    .typeError("Token name must be alphanumeric")
    .required("Token name is required")
    .min(3, "Token name must have between 3 and 30 characters")
    .max(30, "Token name must have between 3 and 30 characters"),
  [getFormItemName(initialSupplyLabel)]: Yup.number()
    .typeError("Initial supply must be a number")
    .required("Initial supply is required")
    .positive("Initial supply must be positive"),
  [getFormItemName(decimalsLabel)]: Yup.number()
    .typeError("Decimals must be a number")
    .required("Decimals are required")
    .integer("Decimals must be an integer")
    .min(0, "Decimals must be between 0 and 18")
    .max(18, "Decimals must be between 0 and 18"),
  [getFormItemName(mintCapLabel)]: Yup.number()
    .typeError("Mint cap must be a number")
    .positive("Mint cap must be positive")
    .when(getFormItemName(initialSupplyLabel), (tokenSupply: number, schema: any) => {
      return schema.test({
        test: (tokenMintCap?: number) => !tokenMintCap || tokenSupply <= tokenMintCap,
        message: "Mint cap must be equal or greater than initial supply",
      });
    }),
});

interface TokenSpecsProps {
  readonly closeModal: () => void;
  readonly setLogoUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  readonly setLogoFile: React.Dispatch<React.SetStateAction<EmbeddedLogoType | undefined>>;
  readonly handleSubmit: (values: FormTokenSpecsFields) => void;
}

export default function TokenSpecs({
  closeModal,
  setLogoUrl,
  setLogoFile,
  handleSubmit,
}: TokenSpecsProps): JSX.Element {
  const [logoError, setLogoError] = useState<string>();

  return (
    <Formik
      initialValues={{
        [getFormItemName(tokenSymbolLabel)]: "",
        [getFormItemName(tokenNameLabel)]: "",
        [getFormItemName(initialSupplyLabel)]: "",
        [getFormItemName(decimalsLabel)]: "",
        [getFormItemName(mintLabel)]: MintType.None,
        [getFormItemName(mintCapLabel)]: "",
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit({
          tokenSymbol: values[getFormItemName(tokenSymbolLabel)].toString(),
          tokenName: values[getFormItemName(tokenNameLabel)].toString(),
          initialSupply: values[getFormItemName(initialSupplyLabel)].toString(),
          decimals: values[getFormItemName(decimalsLabel)].toString(),
          mint: values[getFormItemName(mintLabel)].toString(),
          mintCap: values[getFormItemName(mintCapLabel)].toString(),
        });
      }}
    >
      {({ isValid, submitForm, isSubmitting, values, errors }) => {
        return (
          <Stack gap="s2">
            <ModalHeader title="Create digital asset" isSubmitting={isSubmitting} closeModal={closeModal}>
              <Steps size="small" current={0}>
                <Step />
                <Step />
              </Steps>
            </ModalHeader>
            <Separator />
            <Form>
              <FormStack gap="s1">
                <NameWrapper>
                  <Field label={tokenSymbolLabel} placeholder="Enter token symbol" />
                  <Field label={tokenNameLabel} placeholder="Enter token name" />
                </NameWrapper>
                <FieldsTokenLogo
                  logoUrlLabel={logoUrlLabel}
                  logoFileLabel={logoFileLabel}
                  setLogoUrl={setLogoUrl}
                  setLogoFile={setLogoFile}
                  setLogoError={setLogoError}
                />
                <Separator />
                <FieldsTokenSupply
                  formikValues={values}
                  formikErrors={errors}
                  initialSupplyLabel={initialSupplyLabel}
                  decimalsLabel={decimalsLabel}
                  tokenSymbolLabel={tokenSymbolLabel}
                />
                <FieldsTokenMint mintLabel={mintLabel} mintCapLabel={mintCapLabel} />
                <Separator />
                <ModalButtons
                  buttonPrimary={{
                    text: "Next",
                    disabled: !isValid || !!logoError,
                    onClick: submitForm,
                  }}
                  isLoading={isSubmitting}
                />
              </FormStack>
            </Form>
          </Stack>
        );
      }}
    </Formik>
  );
}
