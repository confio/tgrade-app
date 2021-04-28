import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSdk } from "service";
import { useBalance } from "utils/currency";
import { getAmountField } from "utils/forms";
import * as Yup from "yup";
import { FormField } from "./style";

const { Text } = Typography;

export interface FormDelegateTokensFields {
  readonly amount: string;
}

interface FormDelegateTokensProps {
  readonly submitDelegateTokens: (values: FormDelegateTokensFields) => void;
}

export default function FormDelegateTokens({ submitDelegateTokens }: FormDelegateTokensProps): JSX.Element {
  const { t } = useTranslation(["common", "staking"]);

  const {
    sdkState: { config },
  } = useSdk();
  const balance = useBalance();
  const [maxAmount, setMaxAmount] = useState(Decimal.fromAtomics("0", 0));

  useEffect(() => {
    let mounted = true;

    (async function updateMaxAmount() {
      const stakingBalance = balance.find((coin) => coin.denom === config.stakingToken);
      const stakingDecimals = config.coinMap[config.stakingToken].fractionalDigits;
      const maxAmount = stakingBalance
        ? Decimal.fromAtomics(stakingBalance.amount, stakingDecimals)
        : Decimal.fromAtomics("0", 0);

      if (mounted) setMaxAmount(maxAmount);
    })();

    return () => {
      mounted = false;
    };
  }, [balance, config.coinMap, config.stakingToken]);

  const validationSchema = Yup.object().shape({
    amount: getAmountField(t, maxAmount.toFloatApproximation(), maxAmount.toString()),
  });

  return (
    <Formik
      initialValues={{ amount: "" }}
      onSubmit={submitDelegateTokens}
      validationSchema={validationSchema}
    >
      {(formikProps) => {
        const formDisabled = !(formikProps.isValid && formikProps.dirty);

        return (
          <Form>
            <Stack gap="s2">
              <FormField>
                <Text id="amount-label">{config.coinMap[config.stakingToken].denom}</Text>
                <FormItem name="amount">
                  <Input
                    aria-labelledby="amount-label"
                    name="amount"
                    placeholder={t("staking:enterAmount")}
                  />
                </FormItem>
              </FormField>
              <Button type="primary" onClick={formikProps.submitForm} disabled={formDisabled}>
                {t("staking:delegate")}
              </Button>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
}
