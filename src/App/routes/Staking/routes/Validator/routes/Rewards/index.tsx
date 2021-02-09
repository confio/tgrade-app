import { Coin, coins } from "@cosmjs/launchpad";
import { isBroadcastTxFailure } from "@cosmjs/stargate";
import { Button, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { DataList, Loading } from "App/components/logic";
import { pathOperationResult, pathStaking, pathValidators } from "App/paths";
import * as React from "react";
import { ComponentProps, useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { EncodeMsgWithdrawDelegatorReward, useStakingValidator } from "utils/staking";
import { HeaderTitleStack, MainStack } from "./style";

const { Title, Text } = Typography;

interface RewardsParams {
  readonly validatorAddress: string;
}

export default function Rewards(): JSX.Element {
  const { url: pathRewardsMatched } = useRouteMatch();
  const [loading, setLoading] = useState(false);

  const { handleError } = useError();
  const history = useHistory();
  const { validatorAddress } = useParams<RewardsParams>();

  const { getConfig, getClient, getStakingClient, getAddress } = useSdk();
  const config = getConfig();
  const delegatorAddress = getAddress();

  const validator = useStakingValidator(validatorAddress);
  const [rewards, setRewards] = useState<readonly Coin[]>([]);

  useEffect(() => {
    (async function updateRewards() {
      try {
        const { rewards } = await getStakingClient().distribution.unverified.delegationRewards(
          delegatorAddress,
          validatorAddress,
        );
        const nonNullRewards: readonly Coin[] = rewards
          ? rewards
              .map((coin) => ({
                amount: coin.amount ? coin.amount.slice(0, -18) : "",
                denom: coin.denom || "",
              }))
              .filter((coin) => coin.amount.length && coin.denom.length)
          : [];

        setRewards(nonNullRewards);
      } catch {
        // Do nothing because it throws if delegation does not exist, i.e balance = 0
      }
    })();
  }, [delegatorAddress, getStakingClient, validatorAddress]);

  async function withdrawRewards() {
    setLoading(true);

    const withdrawRewardsMsg: EncodeMsgWithdrawDelegatorReward = {
      typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
      value: { delegatorAddress, validatorAddress },
    };

    const fee = {
      amount: coins(
        config.gasPrice * 10 ** config.coinMap[config.feeToken].fractionalDigits,
        config.feeToken,
      ),
      gas: "1500000",
    };

    try {
      const response = await getClient().signAndBroadcast(delegatorAddress, [withdrawRewardsMsg], fee);
      if (isBroadcastTxFailure(response)) {
        throw new Error("Rewards withdrawal failed");
      }

      history.push({
        pathname: pathOperationResult,
        state: {
          success: true,
          message: `Successfully withdrawn`,
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
          message: "Rewards withdrawal transaction failed:",
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathRewardsMatched,
        },
      });
    }
  }

  function getRewardsMap(): ComponentProps<typeof DataList> {
    const rewardsMap: { [key: string]: string } = {};

    for (const coin of rewards) {
      const coinToDisplay = nativeCoinToDisplay(coin, config.coinMap);
      rewardsMap[coinToDisplay.denom] = coinToDisplay.amount;
    }

    return rewardsMap;
  }

  return loading ? (
    <Loading loadingText={`Withdrawing rewards...`} />
  ) : (
    <PageLayout backButtonProps={{ path: `${pathStaking}${pathValidators}/${validatorAddress}` }}>
      <MainStack>
        <HeaderTitleStack>
          <Title>Pending rewards</Title>
          <Title level={2}>{validator?.description?.moniker ?? ""}</Title>
        </HeaderTitleStack>
        {rewards.length ? (
          <>
            <DataList {...getRewardsMap()} />
            <Button type="primary" onClick={withdrawRewards}>
              Withdraw rewards
            </Button>
          </>
        ) : (
          <Text>No rewards found</Text>
        )}
      </MainStack>
    </PageLayout>
  );
}
