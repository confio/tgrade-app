import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { Loading } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { CW20 } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { getAddAllowanceValidationSchema } from "utils/formSchemas";
import { Amount, FormFieldsStack, FormStack, MainStack } from "./style";

const { Title, Text } = Typography;

interface FormAddAllowanceFields {
  readonly address: string;
  readonly amount: string;
}

interface AddParams {
  readonly contractAddress: string;
}

export default function Add(): JSX.Element {
  const [loading, setLoading] = useState(false);

  const { contractAddress }: AddParams = useParams();
  const pathAllowances = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}${contractAddress}${paths.cw20Wallet.allowances}`;
  const history = useHistory();
  const { handleError } = useError();
  const { getConfig, getSigningClient, getAddress } = useSdk();
  const address = getAddress();

  const [tokenName, setTokenName] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(0);

  useEffect(() => {
    const cw20Contract = CW20(getSigningClient()).use(contractAddress);

    cw20Contract.tokenInfo().then((tokenInfo) => {
      setTokenName(tokenInfo.symbol);
      setTokenDecimals(tokenInfo.decimals);
    });
  }, [getSigningClient, contractAddress]);

  const submitAddAllowance = (values: FormAddAllowanceFields) => {
    setLoading(true);

    const { address: spenderAddress, amount: newAmount } = values;

    const cw20Contract = CW20(getSigningClient()).use(contractAddress);

    cw20Contract.allowance(address, spenderAddress).then(({ allowance }) => {
      const decNewAmount = Decimal.fromUserInput(newAmount, tokenDecimals);
      const decCurrentAmount = Decimal.fromAtomics(allowance, tokenDecimals);

      try {
        let allowanceOperation: Promise<string> = Promise.reject("");

        if (decNewAmount.isGreaterThan(decCurrentAmount)) {
          allowanceOperation = cw20Contract.increaseAllowance(
            address,
            spenderAddress,
            decNewAmount.minus(decCurrentAmount).atomics,
          );
        } else {
          allowanceOperation = cw20Contract.decreaseAllowance(
            address,
            spenderAddress,
            decCurrentAmount.minus(decNewAmount).atomics,
          );
        }

        allowanceOperation.then(() => {
          history.push({
            pathname: paths.operationResult,
            state: {
              success: true,
              message: `${newAmount} ${tokenName} allowance for ${spenderAddress} successfully added `,
              customButtonText: "Allowances",
              customButtonActionPath: pathAllowances,
            } as OperationResultState,
          });
        });
      } catch (stackTrace) {
        handleError(stackTrace);

        history.push({
          pathname: paths.operationResult,
          state: {
            success: false,
            message: "Could not set allowance:",
            error: getErrorFromStackTrace(stackTrace),
            customButtonActionPath: pathAllowances,
          } as OperationResultState,
        });
      }
    });
  };

  return loading ? (
    <Loading loadingText={`Adding allowance...`} />
  ) : (
    <PageLayout backButtonProps={{ path: pathAllowances }}>
      <MainStack>
        <Title>Add Allowance</Title>
        <Formik
          initialValues={{ address: "", amount: "" }}
          onSubmit={submitAddAllowance}
          validationSchema={getAddAllowanceValidationSchema(getConfig().addressPrefix)}
        >
          {(formikProps) => (
            <Form>
              <FormStack>
                <FormFieldsStack>
                  <FormItem name="address">
                    <Input name="address" placeholder="Enter address" />
                  </FormItem>
                  <Amount>
                    <FormItem name="amount">
                      <Input name="amount" placeholder="Enter amount" />
                    </FormItem>
                    <Text>{tokenName}</Text>
                  </Amount>
                </FormFieldsStack>
                <Button
                  type="primary"
                  onClick={formikProps.submitForm}
                  disabled={!(formikProps.isValid && formikProps.dirty)}
                >
                  Confirm
                </Button>
              </FormStack>
            </Form>
          )}
        </Formik>
      </MainStack>
    </PageLayout>
  );
}
