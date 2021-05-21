import { Contract } from "@cosmjs/cosmwasm-stargate";
import { Button } from "antd";
import { TransferItem } from "antd/lib/transfer";
import { Stack } from "App/components/layout";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import { Formik } from "formik";
import { Form, Transfer } from "formik-antd";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useContracts, useError, useSdk } from "service";
import { CW20 } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { useQueriesTyped } from "utils/query";
import { TransferFormItem } from "./style";

interface FormSelectContractsParams {
  readonly codeId: string;
}

export default function FormSelectContracts(): JSX.Element {
  const { t } = useTranslation("cw20Wallet");
  const { url: pathExisting } = useRouteMatch();
  const { codeId } = useParams<FormSelectContractsParams>();
  const pathTokens = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}`;
  const history = useHistory();
  const { handleError } = useError();
  const {
    sdkState: { signingClient },
  } = useSdk();
  const { addContract } = useContracts();

  const { data: contractAddresses = [] } = useQuery(
    "contractAddresses",
    async () => {
      const numCodeId = Number.parseInt(codeId, 10);
      if (Number.isNaN(numCodeId)) {
        throw new Error(`Expected Code Id and instead got ${codeId}`);
      }

      return await signingClient.getContracts(numCodeId);
    },
    {
      onError: (error: Error) => {
        handleError(error);
      },
    },
  );

  const contracts = useQueriesTyped(
    contractAddresses.map((address) => ({
      queryKey: `contract${address}`,
      queryFn: () => signingClient.getContract(address),
      onError: (error: unknown) => {
        handleError(error as Error);
      },
    })),
  )
    .map(({ data }) => data)
    .filter((contract): contract is Contract => contract !== undefined);

  const [selectedContractAddresses, setSelectedContractAddresses] = useState<string[]>([]);

  async function mutationFn() {
    const cw20Contracts = selectedContractAddresses.map((address) => CW20(signingClient).use(address));
    // If any of the selected contracts has no tokenInfo, it throws
    await Promise.all(cw20Contracts.map((contract) => contract.tokenInfo()));
    cw20Contracts.forEach(addContract);
  }

  const mutationOptions = {
    mutationKey: "addCodeId",
    onError: (stackTrace: Error) => {
      handleError(stackTrace);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("addCodeIdFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathExisting,
        } as OperationResultState,
      });
    },
    onSuccess: () => {
      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("addCodeIdSuccess", { codeId }),
          customButtonText: t("tokens"),
          customButtonActionPath: pathTokens,
        } as OperationResultState,
      });
    },
  };

  const { mutate } = useMutation(mutationFn, mutationOptions);
  const submitSelectContracts = () => mutate();

  function filterCaseInsensitive(input: string, option: TransferItem) {
    return option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false;
  }

  return (
    <Formik initialValues={{}} onSubmit={submitSelectContracts}>
      {(formikProps) => (
        <Form>
          <Stack gap="s2">
            <TransferFormItem name="contracts">
              <Transfer
                name="contracts"
                showSearch
                filterOption={filterCaseInsensitive}
                dataSource={contracts.map((contract) => {
                  return { key: contract.address, title: contract.label };
                })}
                onSelectChange={setSelectedContractAddresses}
                listStyle={{ listStyle: "none" }}
                render={(item: TransferItem) => item.title ?? ""}
              />
            </TransferFormItem>
            <Button
              type="primary"
              onClick={formikProps.submitForm}
              disabled={!selectedContractAddresses.length}
            >
              {t("continue")}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
