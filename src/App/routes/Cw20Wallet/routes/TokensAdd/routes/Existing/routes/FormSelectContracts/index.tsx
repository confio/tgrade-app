import { Contract } from "@cosmjs/cosmwasm";
import { Button } from "antd";
import { TransferItem } from "antd/lib/transfer";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import { Formik } from "formik";
import { Form, FormItem, Transfer } from "formik-antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useContracts, useError, useSdk } from "service";
import { CW20 } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { FormStack } from "./style";

interface FormSelectContractsParams {
  readonly codeId: string;
}

export default function FormSelectContracts(): JSX.Element {
  const { url: pathExisting } = useRouteMatch();
  const { codeId } = useParams<FormSelectContractsParams>();
  const pathTokens = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}`;
  const history = useHistory();
  const { handleError } = useError();
  const { getSigningClient } = useSdk();
  const client = getSigningClient();
  const { addContract } = useContracts();

  const [contracts, setContracts] = useState<readonly Contract[]>([]);
  const [selectedContractAddresses, setSelectedContractAddresses] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    (async function updateContracts() {
      try {
        const numCodeId = Number.parseInt(codeId, 10);
        if (Number.isNaN(numCodeId)) {
          throw new Error(`Expected CodeId and instead got: ${codeId}`);
        }

        const contracts = await client.getContracts(numCodeId);
        if (mounted) setContracts(contracts);
      } catch (error) {
        handleError(error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [client, codeId, handleError]);

  async function submitSelectContracts() {
    try {
      const cw20Contracts = selectedContractAddresses.map((address) => CW20(client).use(address));
      // If any of the selected contracts has no tokenInfo, it throws
      await Promise.all(cw20Contracts.map((contract) => contract.tokenInfo()));
      cw20Contracts.forEach(addContract);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: `The selected tokens from CodeID: ${codeId} were successfully added`,
          customButtonText: "Tokens",
          customButtonActionPath: pathTokens,
        } as OperationResultState,
      });
    } catch (stackTrace) {
      handleError(stackTrace);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: "Failed to add selected tokens",
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathExisting,
        } as OperationResultState,
      });
    }
  }

  function filterCaseInsensitive(input: string, option: TransferItem) {
    return option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false;
  }

  return (
    <Formik initialValues={{}} onSubmit={submitSelectContracts}>
      {(formikProps) => (
        <Form>
          <FormStack>
            <FormItem name="contracts">
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
            </FormItem>
            <Button
              type="primary"
              onClick={formikProps.submitForm}
              disabled={!selectedContractAddresses.length}
            >
              Continue
            </Button>
          </FormStack>
        </Form>
      )}
    </Formik>
  );
}
