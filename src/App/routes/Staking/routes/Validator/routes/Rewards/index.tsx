import { Coin } from "@cosmjs/launchpad";
import { Button, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { DataList, Loading } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { ComponentProps, useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { useStakingValidator } from "utils/staking";
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

  const { getConfig, getAddress, getQueryClient, withdrawRewards } = useSdk();
  const config = getConfig();
  const delegatorAddress = getAddress();

  const validator = useStakingValidator(validatorAddress);
  const [rewards, setRewards] = useState<readonly Coin[]>([]);

  useEffect(() => {
    (async function updateRewards() {
      try {
        const { rewards } = await getQueryClient().distribution.unverified.delegationRewards(
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
  }, [delegatorAddress, getQueryClient, validatorAddress]);

  async function submitWithdrawRewards() {
    setLoading(true);

    try {
      await withdrawRewards(validatorAddress);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: `Successfully withdrawn`,
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
    <PageLayout
      backButtonProps={{ path: `${paths.staking.prefix}${paths.staking.validators}/${validatorAddress}` }}
    >
      <MainStack>
        <HeaderTitleStack>
          <Title>Pending rewards</Title>
          <Title level={2}>{validator?.description?.moniker ?? ""}</Title>
        </HeaderTitleStack>
        {rewards.length ? (
          <>
            <DataList {...getRewardsMap()} />
            <Button type="primary" onClick={submitWithdrawRewards}>
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
