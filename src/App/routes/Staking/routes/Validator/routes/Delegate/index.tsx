import { Coin } from "@cosmjs/launchpad";
import { Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { Loading } from "App/components/logic";
import { pathOperationResult, pathStaking, pathValidators } from "App/paths";
import * as React from "react";
import { useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { displayAmountToNative } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { useStakingValidator } from "utils/staking";
import FormDelegateBalance, { FormDelegateBalanceFields } from "./FormDelegateBalance";
import { HeaderTitleStack, MainStack } from "./style";

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
        pathname: pathOperationResult,
        state: {
          success: true,
          message: `${amount} ${config.coinMap[config.stakingToken].denom} successfully delegated`,
          customButtonText: "Validator home",
          customButtonActionPath: `${pathStaking}${pathValidators}/${validatorAddress}`,
        },
      });
    } catch (stackTrace) {
      handleError(stackTrace);

      history.push({
        pathname: pathOperationResult,
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
    <PageLayout backButtonProps={{ path: `${pathStaking}${pathValidators}/${validatorAddress}` }}>
      <MainStack>
        <HeaderTitleStack>
          <Title>Delegate</Title>
          <Title level={2}>{validator?.description?.moniker ?? ""}</Title>
        </HeaderTitleStack>
        <FormDelegateBalance submitDelegateBalance={submitDelegateBalance} />
      </MainStack>
    </PageLayout>
  );
}
