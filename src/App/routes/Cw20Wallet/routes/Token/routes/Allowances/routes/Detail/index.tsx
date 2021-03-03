import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { PageLayout, Stack } from "App/components/layout";
import { Loading } from "App/components/logic";
import { paths } from "App/paths";
import { OperationResultState } from "App/routes/OperationResult";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { CW20, Cw20Token, getCw20Token } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { AddressText, Amount } from "./style";

const { Title, Text } = Typography;

interface DetailParams {
  readonly contractAddress: string;
  readonly spenderAddress: string;
}

export default function Detail(): JSX.Element {
  const [loading, setLoading] = useState(false);

  const { url: pathAllowancesMatched } = useRouteMatch();
  const { contractAddress, spenderAddress }: DetailParams = useParams();
  const pathAllowances = `${paths.cw20Wallet.prefix}${paths.cw20Wallet.tokens}/${contractAddress}${paths.cw20Wallet.allowances}`;

  const history = useHistory();
  const { handleError } = useError();
  const { getSigningClient, getAddress } = useSdk();
  const client = getSigningClient();
  const address = getAddress();

  const [cw20Token, setCw20Token] = useState<Cw20Token>();
  const [allowanceAmount, setAllowanceAmount] = useState("0");

  useEffect(() => {
    let mounted = true;
    const cw20Contract = CW20(client).use(contractAddress);

    (async function updateCw20TokenAndAllowance() {
      const cw20Token = await getCw20Token(cw20Contract, address);
      if (!cw20Token) {
        handleError(new Error(`No CW20 token at address: ${contractAddress}`));
        return;
      }

      if (mounted) setCw20Token(cw20Token);
      const { allowance } = await cw20Contract.allowance(address, spenderAddress);
      if (mounted) setAllowanceAmount(allowance);
    })();

    return () => {
      mounted = false;
    };
  }, [address, client, contractAddress, handleError, spenderAddress]);

  function goToAllowancesEdit() {
    history.push(`${pathAllowancesMatched}${paths.cw20Wallet.edit}`);
  }

  async function submitRemove() {
    setLoading(true);
    const cw20Contract = CW20(client).use(contractAddress);

    try {
      const { allowance } = await cw20Contract.allowance(address, spenderAddress);
      await cw20Contract.decreaseAllowance(address, spenderAddress, allowance);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: `${cw20Token?.symbol || ""} allowance successfully removed for ${spenderAddress}`,
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
          message: "Could not remove allowance:",
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathAllowancesMatched,
        } as OperationResultState,
      });
    }
  }

  const allowanceToDisplay = Decimal.fromAtomics(allowanceAmount || "0", cw20Token?.decimals ?? 0).toString();
  const [allowanceInteger, allowanceDecimal] = allowanceToDisplay.split(".");

  return loading ? (
    <Loading loadingText={`Removing allowance...`} />
  ) : (
    <PageLayout backButtonProps={{ path: pathAllowances }}>
      <Stack gap="s3">
        <Title>{`${cw20Token?.symbol || ""} Allowance`}</Title>
        <Amount>
          <Text>{`${allowanceInteger}${allowanceDecimal ? "." : ""}`}</Text>
          {allowanceDecimal && <Text>{allowanceDecimal}</Text>}
          <Text>{" Tokens"}</Text>
        </Amount>
        <AddressText>{spenderAddress}</AddressText>
        <Button type="primary" onClick={() => goToAllowancesEdit()}>
          Edit
        </Button>
        <Button type="primary" onClick={submitRemove}>
          Remove
        </Button>
      </Stack>
    </PageLayout>
  );
}
