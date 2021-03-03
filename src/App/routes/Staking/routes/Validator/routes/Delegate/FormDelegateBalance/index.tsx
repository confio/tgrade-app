import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import { useBalance } from "utils/currency";
import * as Yup from "yup";
import { FormField } from "./style";

const { Text } = Typography;

export interface FormDelegateBalanceFields {
  readonly amount: string;
}

interface FormDelegateBalanceProps {
  readonly submitDelegateBalance: (values: FormDelegateBalanceFields) => Promise<void>;
}

export default function FormDelegateBalance({
  submitDelegateBalance,
}: FormDelegateBalanceProps): JSX.Element {
  const { getConfig } = useSdk();
  const config = getConfig();
  const balance = useBalance();
  const [maxAmount, setMaxAmount] = useState(0);

  useEffect(() => {
    let mounted = true;

    (async function updateMaxAmount() {
      const stakingBalance = balance.find((coin) => coin.denom === config.stakingToken);
      const stakingDecimals = config.coinMap[config.stakingToken].fractionalDigits;
      const maxAmount = stakingBalance
        ? Decimal.fromAtomics(stakingBalance.amount, stakingDecimals).toFloatApproximation()
        : 0;

      if (mounted) setMaxAmount(maxAmount);
    })();

    return () => {
      mounted = false;
    };
  }, [balance, config.coinMap, config.stakingToken]);

  const delegateBalanceValidationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("An amount is required")
      .positive("Amount should be positive")
      .max(maxAmount),
  });

  return (
    <Formik
      initialValues={{ amount: "" }}
      onSubmit={submitDelegateBalance}
      validationSchema={delegateBalanceValidationSchema}
    >
      {(formikProps) => {
        const formDisabled = !(formikProps.isValid && formikProps.dirty);

        return (
          <Form>
            <Stack gap="s2">
              <FormField>
                <Text>{config.coinMap[config.stakingToken].denom}</Text>
                <FormItem name="amount">
                  <Input name="amount" placeholder="Enter amount" />
                </FormItem>
              </FormField>
              <Button type="primary" onClick={formikProps.submitForm} disabled={formDisabled}>
                Delegate
              </Button>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
}
