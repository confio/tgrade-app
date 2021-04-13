import { Decimal, Uint64 } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import { Formik } from "formik";
import { Form, FormItem, Input, Select } from "formik-antd";
import * as React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { setInitialLayoutState, setLoading, useContracts, useError, useLayout, useSdk } from "service";
import { CW20, MinterResponse } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import * as Yup from "yup";
import { FormField } from "./style";

const { Title, Text } = Typography;
const { Option } = Select;

const pathTokensAdd = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAdd}`;

export interface FormCreateTokenFields {
  readonly tokenSymbol: string;
  readonly tokenName: string;
  readonly tokenDecimals: string;
  readonly tokenSupply: string;
  readonly tokenMint: string;
  readonly tokenMintCap?: string;
}

export default function New(): JSX.Element {
  const { t } = useTranslation(["common", "cw20Wallet"]);
  const history = useHistory();

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathTokensAdd } }), [
    layoutDispatch,
  ]);

  const { handleError } = useError();
  const {
    sdkState: {
      config: { codeId },
      signingClient,
      address,
    },
  } = useSdk();
  const { addContract } = useContracts();

  async function submitCreateToken(values: FormCreateTokenFields) {
    setLoading(layoutDispatch, "Creating token...");

    try {
      if (!codeId) {
        throw new Error("Missing Code Id in configuration file");
      }

      const decimals = parseInt(values.tokenDecimals, 10);
      const amount = Decimal.fromUserInput(values.tokenSupply, decimals)
        .multiply(Uint64.fromNumber(10 ** decimals))
        .toString();
      const cap = values.tokenMintCap
        ? Decimal.fromUserInput(values.tokenMintCap, decimals)
            .multiply(Uint64.fromNumber(10 ** decimals))
            .toString()
        : undefined;
      const canMint = values.tokenMint === "fixed" || values.tokenMint === "unlimited";
      const mint: MinterResponse | undefined = canMint ? { minter: address, cap } : undefined;

      const msg: any = {
        name: values.tokenName,
        symbol: values.tokenSymbol,
        decimals,
        initial_balances: [{ address, amount }],
        mint,
      };

      const { contractAddress } = await signingClient.instantiate(address, codeId, msg, values.tokenSymbol, {
        admin: address,
      });

      const newCw20Contract = CW20(signingClient).use(contractAddress);
      addContract(newCw20Contract);

      const tokenName = values.tokenName;
      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("cw20Wallet:createSuccess", { amount, tokenName }),
          customButtonText: t("cw20Wallet:tokenDetail"),
          customButtonActionPath: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}`,
        } as OperationResultState,
      });
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("cw20Wallet:createFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokensAddNew}`,
        } as OperationResultState,
      });
    }
  }

  const validationSchema = Yup.object().shape({
    tokenSymbol: Yup.string()
      .required(t("form.tokenSymbol.required"))
      .strict()
      .uppercase(t("form.tokenSymbol.uppercase"))
      .min(0, t("form.tokenSymbol.minMax", { min: 0, max: 6 }))
      .max(6, t("form.tokenSymbol.minMax", { min: 0, max: 6 })),
    tokenName: Yup.string()
      .required(t("form.tokenName.required"))
      .min(3, t("form.tokenName.minMax", { min: 3, max: 30 }))
      .max(30, t("form.tokenName.minMax", { min: 3, max: 30 })),
    tokenDecimals: Yup.number()
      .required(t("form.tokenDecimals.required"))
      .integer(t("form.tokenDecimals.integer"))
      .min(0, t("form.tokenDecimals.minMax", { min: 0, max: 18 }))
      .max(18, t("form.tokenDecimals.minMax", { min: 0, max: 18 })),
    tokenSupply: Yup.number()
      .required(t("form.tokenSupply.required"))
      .positive(t("form.tokenSupply.positive")),
    tokenMintCap: Yup.number()
      .positive(t("form.tokenMintCap.positive"))
      .when("tokenSupply", (tokenSupply: number, schema: any) => {
        return schema.test({
          test: (tokenMintCap?: number) => !tokenMintCap || tokenSupply <= tokenMintCap,
          message: t("form.tokenMintCap.min"),
        });
      }),
  });

  return (
    <Stack gap="s4">
      <Title>{t("cw20Wallet:addNewToken")}</Title>
      <Formik
        initialValues={{
          tokenSymbol: "",
          tokenName: "",
          tokenDecimals: "",
          tokenSupply: "",
          tokenMint: "",
          tokenMintCap: "",
        }}
        onSubmit={submitCreateToken}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <Form>
            <Stack gap="s2">
              <Stack>
                <FormField>
                  <Text id="tokenSymbol-label">{t("cw20Wallet:symbol")}</Text>
                  <FormItem name="tokenSymbol">
                    <Input
                      aria-labelledby="tokenSymbol-label"
                      name="tokenSymbol"
                      placeholder={t("cw20Wallet:enterSymbol")}
                    />
                  </FormItem>
                </FormField>
                <FormField>
                  <Text id="tokenName-label">{t("cw20Wallet:name")}</Text>
                  <FormItem name="tokenName">
                    <Input
                      aria-labelledby="tokenName-label"
                      name="tokenName"
                      placeholder={t("cw20Wallet:enterName")}
                    />
                  </FormItem>
                </FormField>
                <FormField>
                  <Text id="tokenDecimals-label">{t("cw20Wallet:displayDecimals")}</Text>
                  <FormItem name="tokenDecimals">
                    <Input
                      aria-labelledby="tokenDecimals-label"
                      name="tokenDecimals"
                      placeholder={t("cw20Wallet:enterDisplayDecimals")}
                    />
                  </FormItem>
                </FormField>
                <FormField>
                  <Text id="tokenSupply-label">{t("cw20Wallet:initialSupply")}</Text>
                  <FormItem name="tokenSupply">
                    <Input
                      aria-labelledby="tokenSupply-label"
                      name="tokenSupply"
                      placeholder={t("cw20Wallet:enterInitialSupply")}
                    />
                  </FormItem>
                </FormField>
                <FormField>
                  <Text>{t("cw20Wallet:mint")}</Text>
                  <FormItem name="tokenMint">
                    <Select name="tokenMint" defaultValue="none">
                      <Option value="none">{t("cw20Wallet:enterMintNone")}</Option>
                      <Option value="fixed">{t("cw20Wallet:enterMintFixedCap")}</Option>
                      <Option value="unlimited">{t("cw20Wallet:enterMintUnlimited")}</Option>
                    </Select>
                  </FormItem>
                </FormField>
                <FormField>
                  <Text id="tokenMintCap-label">{t("cw20Wallet:mintCap")}</Text>
                  <FormItem name="tokenMintCap" data-disabled={formikProps.values.tokenMint !== "fixed"}>
                    <Input
                      aria-labelledby="tokenMintCap-label"
                      name="tokenMintCap"
                      disabled={formikProps.values.tokenMint !== "fixed"}
                      placeholder={t("cw20Wallet:enterMintCap")}
                    />
                  </FormItem>
                </FormField>
              </Stack>
              <Button
                type="primary"
                onClick={formikProps.submitForm}
                disabled={!(formikProps.isValid && formikProps.dirty)}
              >
                {t("cw20Wallet:create")}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Stack>
  );
}
