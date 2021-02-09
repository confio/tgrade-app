import { Coin, coins } from "@cosmjs/launchpad";
import { isBroadcastTxFailure } from "@cosmjs/stargate";
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
import { EncodeMsgUndelegate, useStakingValidator } from "utils/staking";
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
  const { getConfig, getClient, getAddress } = useSdk();

  const validator = useStakingValidator(validatorAddress);

  async function submitUndelegateBalance({ amount }: FormUndelegateBalanceFields) {
    setLoading(true);
    const config = getConfig();
    const delegatorAddress = getAddress();

    const nativeAmountString = displayAmountToNative(amount, config.coinMap, config.stakingToken);
    const nativeAmountCoin: Coin = { amount: nativeAmountString, denom: config.stakingToken };

    const undelegateMsg: EncodeMsgUndelegate = {
      typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
      value: {
        delegatorAddress,
        validatorAddress,
        amount: nativeAmountCoin,
      },
    };

    const fee = {
      amount: coins(
        config.gasPrice * 10 ** config.coinMap[config.feeToken].fractionalDigits,
        config.feeToken,
      ),
      gas: "1500000",
    };

    try {
      const response = await getClient().signAndBroadcast(delegatorAddress, [undelegateMsg], fee);
      if (isBroadcastTxFailure(response)) {
        throw new Error("Undelegate failed");
      }

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
