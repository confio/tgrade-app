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
import FormUndelegateBalance, { FormUndelegateBalanceFields } from "./FormUndelegateBalance";
import { HeaderTitleStack, MainStack } from "./style";

const { Title } = Typography;

interface UndelegateParams {
  readonly validatorAddress: string;
}

export default function Undelegate(): JSX.Element {
  const { url: pathUndelegateMatched } = useRouteMatch();
  const [loading, setLoading] = useState(false);

  const { handleError } = useError();
  const history = useHistory();
  const { validatorAddress } = useParams<UndelegateParams>();
  const { getConfig, undelegateTokens } = useSdk();

  const validator = useStakingValidator(validatorAddress);

  async function submitUndelegateBalance({ amount }: FormUndelegateBalanceFields) {
    setLoading(true);
    const config = getConfig();

    try {
      const nativeAmountString = displayAmountToNative(amount, config.coinMap, config.stakingToken);
      const undelegateAmount: Coin = { amount: nativeAmountString, denom: config.stakingToken };

      await undelegateTokens(validatorAddress, undelegateAmount);

      history.push({
        pathname: pathOperationResult,
        state: {
          success: true,
          message: `${amount} ${config.coinMap[config.stakingToken].denom} successfully undelegated`,
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
          message: "Undelegate transaction failed:",
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathUndelegateMatched,
        },
      });
    }
  }

  return loading ? (
    <Loading loadingText={`Undelegating...`} />
  ) : (
    <PageLayout backButtonProps={{ path: `${pathStaking}${pathValidators}/${validatorAddress}` }}>
      <MainStack>
        <HeaderTitleStack>
          <Title>Undelegate</Title>
          <Title level={2}>{validator?.description?.moniker ?? ""}</Title>
        </HeaderTitleStack>
        <FormUndelegateBalance
          validatorAddress={validatorAddress}
          submitUndelegateBalance={submitUndelegateBalance}
        />
      </MainStack>
    </PageLayout>
  );
}
