import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import * as Yup from "yup";
import { FormField, FormStack } from "./style";

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
  const { getConfig, getAddress, getQueryClient } = useSdk();

  const [balance, setBalance] = useState<Decimal>(Decimal.fromUserInput("0", 0));

  const maxAmount = balance.toFloatApproximation();
  const undelegateBalanceValidationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("An amount is required")
      .positive("Amount should be positive")
      .max(maxAmount),
  });

  useEffect(() => {
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

        setBalance(balanceDecimal);
      } catch {
        // Do nothing because it throws if delegation does not exist, i.e balance = 0
      }
    })();
  }, [getAddress, getConfig, getQueryClient, validatorAddress]);

  return (
    <Formik
      initialValues={{ amount: "" }}
      onSubmit={submitUndelegateBalance}
      validationSchema={undelegateBalanceValidationSchema}
    >
      {(formikProps) => (
        <Form>
          <FormStack>
            <FormField>
              <Text>Balance</Text>
              <Text>{balance.toString()}</Text>
            </FormField>
            <FormField>
              <Text>Undelegate</Text>
              <FormItem name="amount">
                <Input name="amount" placeholder="Enter amount" />
              </FormItem>
            </FormField>
            <Button
              type="primary"
              onClick={formikProps.submitForm}
              disabled={!(formikProps.isValid && formikProps.dirty)}
            >
              Undelegate
            </Button>
          </FormStack>
        </Form>
      )}
    </Formik>
  );
}
