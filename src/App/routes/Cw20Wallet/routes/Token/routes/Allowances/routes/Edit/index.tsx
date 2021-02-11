import { Decimal } from "@cosmjs/math";
import { Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { Loading } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { CW20 } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import FormChangeAmount, { FormChangeAmountFields } from "./FormChangeAmount";
import { Amount, MainStack } from "./style";

const { Title, Text } = Typography;

interface EditParams {
  readonly contractAddress: string;
  readonly spenderAddress: string;
}

export default function Edit(): JSX.Element {
  const [loading, setLoading] = useState(false);

  const { contractAddress, spenderAddress }: EditParams = useParams();
  const pathAllowances = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}${contractAddress}${paths.cw20Wallet.allowances}`;
  const history = useHistory();
  const { handleError } = useError();
  const { getSigningClient, getAddress } = useSdk();
  const address = getAddress();

  const [tokenName, setTokenName] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(0);
  const [allowanceAmount, setAllowanceAmount] = useState("0");

  useEffect(() => {
    const cw20Contract = CW20(getSigningClient()).use(contractAddress);

    cw20Contract.tokenInfo().then((tokenInfo) => {
      setTokenName(tokenInfo.symbol);
      setTokenDecimals(tokenInfo.decimals);
    });
    cw20Contract.allowance(address, spenderAddress).then(({ allowance }) => setAllowanceAmount(allowance));
  }, [getSigningClient, contractAddress, address, spenderAddress]);

  const submitChangeAmount = (values: FormChangeAmountFields) => {
    setLoading(true);

    const { newAmount } = values;

    const decNewAmount = Decimal.fromUserInput(newAmount, tokenDecimals);
    const decCurrentAmount = Decimal.fromAtomics(allowanceAmount, tokenDecimals);
    const cw20Contract = CW20(getSigningClient()).use(contractAddress);

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
            message: `${tokenName} allowance successfully set to ${newAmount} for ${spenderAddress}`,
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
  };

  const amountToDisplay = Decimal.fromAtomics(allowanceAmount, tokenDecimals).toString();

  return loading ? (
    <Loading loadingText={`Changing allowance...`} />
  ) : (
    <PageLayout backButtonProps={{ path: pathAllowances }}>
      <MainStack>
        <Title>Allowance</Title>
        <Text>{spenderAddress}</Text>
        <Amount>
          <Text>Current</Text>
          <Text>{amountToDisplay}</Text>
          <Text>{tokenName}</Text>
        </Amount>
        <FormChangeAmount submitChangeAmount={submitChangeAmount} />
      </MainStack>
    </PageLayout>
  );
}
