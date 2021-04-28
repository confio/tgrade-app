import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useSdk } from "service";
import { getAmountField } from "utils/forms";
import * as Yup from "yup";
import { FormField } from "./style";

const { Text } = Typography;

export interface FormUndelegateTokensFields {
  readonly amount: string;
}

interface FormUndelegateTokensProps {
  readonly validatorAddress: string;
  readonly submitUndelegateTokens: (values: FormUndelegateTokensFields) => void;
}

export default function FormUndelegateTokens({
  validatorAddress,
  submitUndelegateTokens,
}: FormUndelegateTokensProps): JSX.Element {
  const { t } = useTranslation(["common", "staking"]);
  const {
    sdkState: { config, address, queryClient },
  } = useSdk();

  const { data: stakedTokensData } = useQuery("stakedTokens", () =>
    queryClient.staking.unverified.delegation(address, validatorAddress),
  );

  const stakedTokens = Decimal.fromAtomics(
    stakedTokensData?.delegationResponse?.balance?.amount || "0",
    config.coinMap[config.stakingToken].fractionalDigits,
  );

  const validationSchema = Yup.object().shape({
    amount: getAmountField(t, stakedTokens.toFloatApproximation(), stakedTokens.toString()),
  });

  return (
    <Formik
      initialValues={{ amount: "" }}
      onSubmit={submitUndelegateTokens}
      validationSchema={validationSchema}
    >
      {(formikProps) => (
        <Form>
          <Stack gap="s2">
            <Stack>
              <FormField>
                <Text>{t("staking:balance")}</Text>
                <Text>{stakedTokens.toString()}</Text>
              </FormField>
              <FormField>
                <Text id="amount-label">{t("staking:undelegate")}</Text>
                <FormItem name="amount">
                  <Input
                    aria-labelledby="amount-label"
                    name="amount"
                    placeholder={t("staking:enterAmount")}
                  />
                </FormItem>
              </FormField>
            </Stack>
            <Button
              type="primary"
              onClick={formikProps.submitForm}
              disabled={!(formikProps.isValid && formikProps.dirty)}
            >
              {t("staking:undelegate")}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
