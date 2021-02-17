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
import { CW20, Cw20Token, getCw20Token } from "utils/cw20";
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
  const pathAllowances = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}${paths.cw20Wallet.allowances}`;

  const history = useHistory();
  const { handleError } = useError();
  const { getSigningClient, getAddress } = useSdk();
  const client = getSigningClient();
  const address = getAddress();

  const [cw20Token, setCw20Token] = useState<Cw20Token>();
  const [allowanceAmount, setAllowanceAmount] = useState("0");

  useEffect(() => {
    const cw20Contract = CW20(client).use(contractAddress);

    (async function updateCw20TokenAndAllowance() {
      const cw20Token = await getCw20Token(cw20Contract, address);
      if (!cw20Token) {
        handleError(new Error(`No CW20 token at address: ${contractAddress}`));
        return;
      }

      setCw20Token(cw20Token);
      const { allowance } = await cw20Contract.allowance(address, spenderAddress);
      setAllowanceAmount(allowance);
    })();
  }, [address, client, contractAddress, handleError, spenderAddress]);

  async function submitChangeAmount(values: FormChangeAmountFields): Promise<void> {
    setLoading(true);

    const { newAmount } = values;
    const cw20Contract = CW20(getSigningClient()).use(contractAddress);

    try {
      const decNewAmount = Decimal.fromUserInput(newAmount, cw20Token?.decimals ?? 0);
      const decCurrentAmount = Decimal.fromAtomics(allowanceAmount, cw20Token?.decimals ?? 0);

      if (decNewAmount.isGreaterThan(decCurrentAmount)) {
        await cw20Contract.increaseAllowance(
          address,
          spenderAddress,
          decNewAmount.minus(decCurrentAmount).atomics,
        );
      } else {
        await cw20Contract.decreaseAllowance(
          address,
          spenderAddress,
          decCurrentAmount.minus(decNewAmount).atomics,
        );
      }

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: `${
            cw20Token?.symbol || ""
          } allowance successfully set to ${newAmount} for ${spenderAddress}`,
          customButtonText: "Allowances",
          customButtonActionPath: pathAllowances,
        } as OperationResultState,
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
  }

  const amountToDisplay = Decimal.fromAtomics(allowanceAmount, cw20Token?.decimals ?? 0).toString();

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
          <Text>{cw20Token?.symbol || ""}</Text>
        </Amount>
        <FormChangeAmount submitChangeAmount={submitChangeAmount} />
      </MainStack>
    </PageLayout>
  );
}
