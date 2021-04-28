import { Button } from "antd";
import { Stack } from "App/components/layout";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import { Formik } from "formik";
import { Form, FormItem, Input } from "formik-antd";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useContracts, useError, useSdk } from "service";
import { CW20, CW20Instance } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { getAddressField } from "utils/forms";
import * as Yup from "yup";

interface MutateVariables {
  readonly newCw20Contract: CW20Instance;
}

interface FormInputContractFields {
  readonly codeIdOrAddress: string;
}

export default function FormInputContract(): JSX.Element {
  const { t } = useTranslation(["common", "cw20Wallet"]);
  const { url: pathExisting } = useRouteMatch();
  const history = useHistory();
  const { handleError } = useError();
  const {
    sdkState: { config, signingClient },
  } = useSdk();
  const { addContract } = useContracts();

  async function mutationFn({ newCw20Contract }: MutateVariables) {
    // If the new contract has no tokenInfo, it throws
    await newCw20Contract.tokenInfo();
  }

  const mutationOptions = {
    mutationKey: "addCodeId",
    onError: (stackTrace: Error) => {
      handleError(stackTrace);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("cw20Wallet:addContractFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathExisting,
        } as OperationResultState,
      });
    },
    onSuccess: (_: unknown, { newCw20Contract }: MutateVariables) => {
      addContract(newCw20Contract);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("cw20Wallet:addContractSuccess", { contractAddress: newCw20Contract.contractAddress }),
          customButtonText: t("cw20Wallet:tokens"),
          customButtonActionPath: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}`,
        } as OperationResultState,
      });
    },
  };

  const { mutate } = useMutation(mutationFn, mutationOptions);

  function submitInputContract({ codeIdOrAddress }: FormInputContractFields) {
    const codeId = Number.parseInt(codeIdOrAddress, 10);
    if (!Number.isNaN(codeId)) {
      history.push(`${pathExisting}/${codeId}`);
      return;
    }

    const contractAddress = codeIdOrAddress;
    const newCw20Contract = CW20(signingClient).use(contractAddress);
    mutate({ newCw20Contract });
  }

  const validationSchema = Yup.object().shape({
    codeIdOrAddress: Yup.lazy((codeIdOrAddress) => {
      if (!Number.isNaN(Number.parseInt(codeIdOrAddress, 10))) {
        return Yup.number().positive(t("form.codeId.positive"));
      }

      return getAddressField(t, config.addressPrefix);
    }),
  });

  return (
    <Formik
      initialValues={{ codeIdOrAddress: "" }}
      onSubmit={submitInputContract}
      validationSchema={validationSchema}
    >
      {(formikProps) => (
        <Form>
          <Stack gap="s2">
            <FormItem name="codeIdOrAddress">
              <Input name="codeIdOrAddress" placeholder={t("cw20Wallet:enterCodeIdOrAddress")} />
            </FormItem>
            <Button
              type="primary"
              onClick={formikProps.submitForm}
              disabled={!(formikProps.isValid && formikProps.dirty)}
            >
              {t("cw20Wallet:continue")}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
