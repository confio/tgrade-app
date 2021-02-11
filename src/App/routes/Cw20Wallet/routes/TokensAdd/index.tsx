import { Contract } from "@cosmjs/cosmwasm";
import { Button, Typography } from "antd";
import { TransferItem } from "antd/lib/transfer";
import { PageLayout } from "App/components/layout";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import { Formik } from "formik";
import { Form, FormItem, Input, Transfer } from "formik-antd";
import * as React from "react";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useContracts, useError, useSdk } from "service";
import { CW20 } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { getContractValidationSchema } from "utils/formSchemas";
import { FormStack, MainStack } from "./style";

const { Title } = Typography;

interface FormInputContractFields {
  readonly contract: string;
}

export default function TokensAdd(): JSX.Element {
  const { path: pathTokensAddMatched } = useRouteMatch();
  const history = useHistory();
  const { handleError } = useError();
  const { getConfig, getSigningClient } = useSdk();
  const { addContract } = useContracts();

  const [codeId, setCodeId] = useState<number>();

  const [contracts, setContracts] = useState<readonly Contract[]>([]);
  const [selectedContractAddresses, setSelectedContractAddresses] = useState<string[]>([]);

  function submitInputContract({ contract }: FormInputContractFields) {
    const codeId = !Number.isNaN(Number(contract)) && Number(contract);

    if (codeId) {
      getSigningClient()
        .getContracts(codeId)
        .then((contracts) => {
          setContracts(contracts);
          setCodeId(codeId);
        })
        .catch(handleError);
    } else {
      const contractAddress = String(contract);
      const newCw20Contract = CW20(getSigningClient()).use(contractAddress);

      newCw20Contract
        .tokenInfo()
        .then(() => addContract(newCw20Contract))
        .then(() =>
          history.push({
            pathname: paths.operationResult,
            state: {
              success: true,
              message: `"${contractAddress}" was successfully added :)`,
              customButtonText: "Tokens",
            } as OperationResultState,
          }),
        )
        .catch((stackTrace) => {
          handleError(stackTrace);

          history.push({
            pathname: paths.operationResult,
            state: {
              success: false,
              message: "Oh no... Something went wrong, please try again",
              error: getErrorFromStackTrace(stackTrace),
              customButtonActionPath: pathTokensAddMatched,
            } as OperationResultState,
          });
        });
    }
  }

  function handleChangeSelected(selectedAddresses: string[]) {
    setSelectedContractAddresses(selectedAddresses);
  }

  function submitSelectContracts() {
    selectedContractAddresses.forEach((address) => {
      const newCw20Contract = CW20(getSigningClient()).use(address);

      newCw20Contract
        .tokenInfo()
        .then(() => addContract(newCw20Contract))
        .catch((stackTrace) => {
          handleError(stackTrace);

          history.push({
            pathname: paths.operationResult,
            state: {
              success: false,
              message: "Oh no... Something went wrong, please try again",
              error: getErrorFromStackTrace(stackTrace),
              customButtonActionPath: pathTokensAddMatched,
            } as OperationResultState,
          });
        });
    });

    history.push({
      pathname: paths.operationResult,
      state: {
        success: true,
        message: `"Your CodeID: ${codeId}" were successfully added :)`,
        customButtonText: "Tokens",
      } as OperationResultState,
    });
  }

  function filterCaseInsensitive(input: string, option: TransferItem) {
    return option.title ? option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 : false;
  }

  const showInputContract = !codeId;
  const showCodeIdForm = !showInputContract;

  return (
    <PageLayout backButtonProps={{ path: `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}` }}>
      <MainStack>
        <Title>Add Other</Title>
        {showInputContract && (
          <Formik
            initialValues={{ contract: "" }}
            onSubmit={submitInputContract}
            validationSchema={getContractValidationSchema(getConfig().addressPrefix)}
          >
            {(formikProps) => (
              <Form>
                <FormStack>
                  <FormItem name="contract">
                    <Input name="contract" placeholder="Enter a contract address or codeID" />
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
        )}
        {showCodeIdForm && (
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
                      onSelectChange={handleChangeSelected}
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
        )}
      </MainStack>
    </PageLayout>
  );
}
