import { Button } from "antd";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useContracts, useError, useSdk } from "service";
import { CW20 } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { getCodeIdOrAddressValidationSchema } from "utils/formSchemas";
import { FormStack } from "./style";

interface FormInputContractFields {
  readonly codeIdOrAddress: string;
}

export default function FormInputContract(): JSX.Element {
  const { url: pathExisting } = useRouteMatch();
  const history = useHistory();
  const { handleError } = useError();
  const { getConfig, getSigningClient } = useSdk();
  const { addContract } = useContracts();

  async function submitInputContract({ codeIdOrAddress }: FormInputContractFields) {
    const codeId = Number.parseInt(codeIdOrAddress, 10);
    if (!Number.isNaN(codeId)) {
      history.push(`${pathExisting}/${codeId}`);
      return;
    }

    const contractAddress = codeIdOrAddress;
    const newCw20Contract = CW20(getSigningClient()).use(contractAddress);

    try {
      // If the new contract has no tokenInfo, it throws
      await newCw20Contract.tokenInfo();
      addContract(newCw20Contract);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: `Contract with address: ${contractAddress} successfully added`,
          customButtonText: "Tokens",
          customButtonActionPath: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}`,
        } as OperationResultState,
      });
    } catch (stackTrace) {
      handleError(stackTrace);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: "Failed to add token",
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathExisting,
        } as OperationResultState,
      });
    }
  }

  return (
    <Formik
      initialValues={{ codeIdOrAddress: "" }}
      onSubmit={submitInputContract}
      validationSchema={getCodeIdOrAddressValidationSchema(getConfig().addressPrefix)}
    >
      {(formikProps) => (
        <Form>
          <FormStack>
            <FormItem name="codeIdOrAddress">
              <Input name="codeIdOrAddress" placeholder="Enter a contract address or codeID" />
            </FormItem>
            <Button
              type="primary"
              onClick={formikProps.submitForm}
              disabled={!(formikProps.isValid && formikProps.dirty)}
            >
              Continue
            </Button>
          </FormStack>
        </Form>
      )}
    </Formik>
  );
}
