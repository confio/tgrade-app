import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSdk } from "service";
import { getAmountField } from "utils/forms";
import * as Yup from "yup";
import { FormField } from "./style";

const { Text } = Typography;

export interface FormUndelegateBalanceFields {
  readonly amount: string;
}

interface FormUndelegateBalanceProps {
  readonly validatorAddress: string;
  readonly submitUndelegateBalance: (values: FormUndelegateBalanceFields) => Promise<void>;
}

export default function FormUndelegateBalance({
  validatorAddress,
  submitUndelegateBalance,
}: FormUndelegateBalanceProps): JSX.Element {
  const { t } = useTranslation(["common", "staking"]);
  const { getConfig, getAddress, getQueryClient } = useSdk();

  const [balance, setBalance] = useState<Decimal>(Decimal.fromAtomics("0", 0));

  useEffect(() => {
    let mounted = true;
    const delegatorAddress = getAddress();
    const config = getConfig();

    (async function updateBalance() {
      try {
        const { delegationResponse } = await getQueryClient().staking.unverified.delegation(
          delegatorAddress,
          validatorAddress,
        );

        const balanceDecimal = Decimal.fromAtomics(
          delegationResponse?.balance?.amount || "0",
          config.coinMap[config.stakingToken].fractionalDigits,
        );

        if (mounted) setBalance(balanceDecimal);
      } catch {
        // Do nothing because it throws if delegation does not exist, i.e balance = 0
      }
    })();

    return () => {
      mounted = false;
    };
  }, [getAddress, getConfig, getQueryClient, validatorAddress]);

  const validationSchema = Yup.object().shape({
    amount: getAmountField(t, balance.toFloatApproximation(), balance.toString()),
  });

  return (
    <Formik
      initialValues={{ amount: "" }}
      onSubmit={submitUndelegateBalance}
      validationSchema={validationSchema}
    >
      {(formikProps) => (
        <Form>
          <Stack gap="s2">
            <Stack>
              <FormField>
                <Text>{t("staking:balance")}</Text>
                <Text>{balance.toString()}</Text>
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
