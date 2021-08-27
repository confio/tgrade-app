import { Decimal, Uint64 } from "@cosmjs/math";
import Field from "App/components/Field";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import * as React from "react";
import { useError, useSdk } from "service";
import { Contract20WS, MinterInterface } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";
import FieldsTokenLogo from "../../components/FieldsTokenLogo";
import FieldsTokenMint, { MintType } from "../../components/FieldsTokenMint";
import FieldsTokenSupply from "../../components/FieldsTokenSupply";
import ModalButtons from "../../components/ModalButtons";
import ModalHeader from "../../components/ModalHeader";
import { DsoWrapper, FormStack, NameWrapper, Separator } from "./style";

export interface FormIssueTokenFields {
  readonly tokenSymbol: string;
  readonly tokenName: string;
  readonly mint: string;
  readonly mintCap?: string;
  readonly initialSupply: string;
  readonly decimals: string;
}

const tokenSymbolLabel = "Token symbol";
const tokenNameLabel = "Token name";
const logoUrlLabel = "URL of the logo SVG image";
const logoFileLabel = "Upload Logo (SVG)";
const dsoAddressLabel = "Trusted Circle to associate with";
const mintLabel = "Mint";
const mintCapLabel = "Mint cap";
const initialSupplyLabel = "Initial supply";
const decimalsLabel = "Set decimal places";

const validationSchema = Yup.object().shape({
  [getFormItemName(tokenSymbolLabel)]: Yup.string()
    .typeError("Token symbol must be alphanumeric")
    .required("Token symbol is required")
    .min(3, "Token symbol must have between 3 and 6 characters")
    .max(6, "Token symbol must have between 3 and 6 characters"),
  [getFormItemName(tokenSymbolLabel)]: Yup.string()
    .typeError("Token name must be alphanumeric")
    .required("Token name is required")
    .min(3, "Token name must have between 3 and 30 characters")
    .max(30, "Token name must have between 3 and 30 characters"),
  [getFormItemName(mintCapLabel)]: Yup.number()
    .typeError("Mint cap must be a number")
    .positive("Mint cap must be positive")
    .when(getFormItemName(initialSupplyLabel), (tokenSupply: number, schema: any) => {
      return schema.test({
        test: (tokenMintCap?: number) => !tokenMintCap || tokenSupply <= tokenMintCap,
        message: "Mint cap must be equal or greater than initial supply",
      });
    }),
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
});

interface IssueTokenFormProps {
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
  readonly closeModal: () => void;
}

export default function IssueTokenForm({ setTxResult, closeModal }: IssueTokenFormProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, address, signingClient },
  } = useSdk();

  async function handleSubmit(values: FormIssueTokenFields) {
    if (!signingClient || !address || !config.codeIds?.cw20Tokens?.length) return;
    console.log(values);

    try {
      const decimals = parseInt(values.decimals, 10);
      const amount = Decimal.fromUserInput(values.initialSupply, decimals)
        .multiply(Uint64.fromNumber(10 ** decimals))
        .toString();
      const cap = values.mintCap
        ? Decimal.fromUserInput(values.mintCap, decimals)
            .multiply(Uint64.fromNumber(10 ** decimals))
            .toString()
        : undefined;
      const canMint = values.mint === "fixed" || values.mint === "unlimited";
      const mint: MinterInterface | undefined = canMint ? { minter: address, cap } : undefined;

      const tokenName = values.tokenName;
      const tokenSymbol = values.tokenSymbol;

      const contractAddress = await Contract20WS.createContract(
        signingClient,
        config.codeIds.cw20Tokens[0],
        address,
        tokenName,
        tokenSymbol,
        decimals,
        [{ address, amount }],
        mint,
      );

      setTxResult({
        contractAddress,
        msg: `You created token ${tokenName} (${contractAddress}).`,
      });
    } catch (error) {
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    }
  }

  return (
    <Formik
      initialValues={{
        [getFormItemName(tokenSymbolLabel)]: "",
        [getFormItemName(tokenSymbolLabel)]: "",
        [getFormItemName(mintLabel)]: MintType.None,
        [getFormItemName(mintCapLabel)]: "",
        [getFormItemName(initialSupplyLabel)]: "",
        [getFormItemName(decimalsLabel)]: "",
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) =>
        handleSubmit({
          tokenSymbol: values[getFormItemName(tokenSymbolLabel)].toString(),
          tokenName: values[getFormItemName(tokenSymbolLabel)].toString(),
          mint: values[getFormItemName(mintLabel)].toString(),
          mintCap: values[getFormItemName(mintCapLabel)].toString(),
          initialSupply: values[getFormItemName(initialSupplyLabel)].toString(),
          decimals: values[getFormItemName(decimalsLabel)].toString(),
        })
      }
    >
      {({ isValid, submitForm, isSubmitting, values, errors }) => {
        return (
          <Stack gap="s2">
            <ModalHeader title="Create digital asset" isSubmitting={isSubmitting} closeModal={closeModal} />
            <Separator />
            <Form>
              <FormStack gap="s1">
                <NameWrapper>
                  <Field label={tokenSymbolLabel} placeholder="Enter token symbol" />
                  <Field label={tokenNameLabel} placeholder="Enter token name" />
                </NameWrapper>
                <FieldsTokenLogo logoUrlLabel={logoUrlLabel} logoFileLabel={logoFileLabel} />
                <DsoWrapper>
                  <Field label={dsoAddressLabel} placeholder="Enter address" />
                </DsoWrapper>
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
                  buttonPrimaryTitle="Create asset"
                  buttonPrimaryDisabled={!isValid}
                  buttonPrimaryOnClick={() => submitForm()}
                />
              </FormStack>
            </Form>
          </Stack>
        );
      }}
    </Formik>
  );
}
