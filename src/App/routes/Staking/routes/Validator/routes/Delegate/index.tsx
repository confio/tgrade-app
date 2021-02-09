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
import { EncodeMsgDelegate, useStakingValidator } from "utils/staking";
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
  const { getConfig, getClient, getAddress } = useSdk();
  const delegatorAddress = getAddress();

  const validator = useStakingValidator(validatorAddress);

  async function submitDelegateBalance({ amount }: FormDelegateBalanceFields) {
    setLoading(true);

    const config = getConfig();
    const nativeAmountString = displayAmountToNative(amount, config.coinMap, config.stakingToken);
    const nativeAmountCoin: Coin = { amount: nativeAmountString, denom: config.stakingToken };

    const delegateMsg: EncodeMsgDelegate = {
      typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
      value: { delegatorAddress, validatorAddress, amount: nativeAmountCoin },
    };

    const fee = {
      amount: coins(
        config.gasPrice * 10 ** config.coinMap[config.feeToken].fractionalDigits,
        config.feeToken,
      ),
      gas: "1500000",
    };

    try {
      const response = await getClient().signAndBroadcast(delegatorAddress, [delegateMsg], fee);
      if (isBroadcastTxFailure(response)) {
        throw new Error("Delegate failed");
      }

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
