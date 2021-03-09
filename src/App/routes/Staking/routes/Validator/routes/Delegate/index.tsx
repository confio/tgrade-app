import { Coin } from "@cosmjs/launchpad";
import { Typography } from "antd";
import { PageLayout, Stack } from "App/components/layout";
import { Loading } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { displayAmountToNative } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { useStakingValidator } from "utils/staking";
import FormDelegateBalance, { FormDelegateBalanceFields } from "./FormDelegateBalance";

const { Title } = Typography;

interface DelegateParams {
  readonly validatorAddress: string;
}

export default function Delegate(): JSX.Element {
  const { url: pathDelegateMatched } = useRouteMatch();
  const [loading, setLoading] = useState(false);

  const { handleError } = useError();
  const history = useHistory();
  const { validatorAddress } = useParams<DelegateParams>();
  const { getConfig, delegateTokens } = useSdk();

  const validator = useStakingValidator(validatorAddress);

  async function submitDelegateBalance({ amount }: FormDelegateBalanceFields) {
    setLoading(true);
    const config = getConfig();

    try {
      const nativeAmountString = displayAmountToNative(amount, config.coinMap, config.stakingToken);
      const delegateAmount: Coin = { amount: nativeAmountString, denom: config.stakingToken };

      await delegateTokens(validatorAddress, delegateAmount);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: `${amount} ${config.coinMap[config.stakingToken].denom} successfully delegated`,
          customButtonText: "Validator home",
          customButtonActionPath: `${paths.staking.prefix}${paths.staking.validators}/${validatorAddress}`,
        },
      });
    } catch (stackTrace) {
      handleError(stackTrace);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: "Delegate transaction failed:",
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathDelegateMatched,
        },
      });
    }
  }

  return loading ? (
    <Loading loadingText={`Delegating...`} />
  ) : (
    <PageLayout
      backButtonProps={{ path: `${paths.staking.prefix}${paths.staking.validators}/${validatorAddress}` }}
    >
      <Stack gap="s6">
        <Stack>
          <Title>Delegate</Title>
          <Title level={2}>{validator?.description?.moniker ?? ""}</Title>
        </Stack>
        <FormDelegateBalance submitDelegateBalance={submitDelegateBalance} />
      </Stack>
    </PageLayout>
  );
}
