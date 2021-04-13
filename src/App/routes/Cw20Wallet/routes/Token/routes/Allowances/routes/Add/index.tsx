import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { TokenAmount } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { setInitialLayoutState, setLoading, useError, useLayout, useSdk } from "service";
import { CW20, Cw20Token, getCw20Token } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { getAddressField, getAmountField } from "utils/forms";
import * as Yup from "yup";
import { FormAmount } from "./style";

const { Title, Text } = Typography;

interface FormAddAllowanceFields {
  readonly address: string;
  readonly amount: string;
}

interface AddParams {
  readonly contractAddress: string;
}

export default function Add(): JSX.Element {
  const { t } = useTranslation(["common", "cw20Wallet"]);

  const history = useHistory();
  const { contractAddress }: AddParams = useParams();
  const pathAllowances = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}${paths.cw20Wallet.allowances}`;

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathAllowances } }), [
    layoutDispatch,
    pathAllowances,
  ]);

  const { handleError } = useError();
  const {
    sdkState: { config, signingClient, address },
  } = useSdk();

  const [cw20Token, setCw20Token] = useState<Cw20Token>();

  useEffect(() => {
    let mounted = true;
    const cw20Contract = CW20(signingClient).use(contractAddress);

    (async function updateCw20Token() {
      const cw20Token = await getCw20Token(cw20Contract, address);
      if (!cw20Token) {
        handleError(new Error(`No CW20 token at address: ${contractAddress}`));
        return;
      }

      if (mounted) setCw20Token(cw20Token);
    })();

    return () => {
      mounted = false;
    };
  }, [address, contractAddress, handleError, signingClient, t]);

  async function submitAddAllowance(values: FormAddAllowanceFields): Promise<void> {
    setLoading(layoutDispatch, `${t("cw20Wallet:adding")}`);

    const { address: spenderAddress, amount: newAmount } = values;
    const cw20Contract = CW20(signingClient).use(contractAddress);

    try {
      const { allowance } = await cw20Contract.allowance(address, spenderAddress);
      const newAmountDecimal = Decimal.fromUserInput(newAmount, cw20Token?.decimals ?? 0);
      const currentAmountDecimal = Decimal.fromAtomics(allowance, cw20Token?.decimals ?? 0);

      if (newAmountDecimal.isGreaterThan(currentAmountDecimal)) {
        await cw20Contract.increaseAllowance(
          address,
          spenderAddress,
          newAmountDecimal.minus(currentAmountDecimal).atomics,
        );
      } else {
        await cw20Contract.decreaseAllowance(
          address,
          spenderAddress,
          currentAmountDecimal.minus(newAmountDecimal).atomics,
        );
      }

      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("cw20Wallet:addSuccess", { newAmount, symbol: cw20Token?.symbol || "", spenderAddress }),
          customButtonText: t("cw20Wallet:allowances"),
          customButtonActionPath: pathAllowances,
        } as OperationResultState,
      });
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("cw20Wallet:addFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathAllowances,
        } as OperationResultState,
      });
    }
  }

  const amountToDisplay = Decimal.fromAtomics(cw20Token?.amount || "0", cw20Token?.decimals ?? 0).toString();
  const [amountInteger, amountDecimal] = amountToDisplay.split(".");

  const validationSchema = Yup.object().shape({
    address: getAddressField(t, config.addressPrefix),
    amount: getAmountField(t),
  });

  return (
    <Stack gap="s7">
      <Title>{t("cw20Wallet:addAllowance")}</Title>
      <TokenAmount>
        <Text>{`${amountInteger}${amountDecimal ? "." : ""}`}</Text>
        {amountDecimal && <Text>{amountDecimal}</Text>}
        <Text>{` ${t("cw20Wallet:tokens")}`}</Text>
      </TokenAmount>
      <Formik
        initialValues={{ address: "", amount: "" }}
        onSubmit={submitAddAllowance}
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <Form>
            <Stack gap="s7">
              <Stack gap="s2">
                <FormAmount>
                  <FormItem name="amount">
                    <Input name="amount" placeholder={t("cw20Wallet:enterAmount")} />
                  </FormItem>
                  <Text>{cw20Token?.symbol || ""}</Text>
                </FormAmount>
                <FormItem name="address">
                  <Input name="address" placeholder={t("cw20Wallet:enterAddress")} />
                </FormItem>
              </Stack>
              <Button
                type="primary"
                onClick={formikProps.submitForm}
                disabled={!(formikProps.isValid && formikProps.dirty)}
              >
                {t("cw20Wallet:add")}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Stack>
  );
}
