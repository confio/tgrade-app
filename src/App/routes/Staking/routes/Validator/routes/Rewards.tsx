import { Coin } from "@cosmjs/launchpad";
import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { DataList } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { ComponentProps, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { setInitialLayoutState, setLoading, useLayout } from "service/layout";
import { nativeCoinToDisplay } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { useStakingValidator } from "utils/staking";

const { Title, Text } = Typography;

interface RewardsParams {
  readonly validatorAddress: string;
}

export default function Rewards(): JSX.Element {
  const { t } = useTranslation("staking");

  const history = useHistory();
  const { url: pathRewardsMatched } = useRouteMatch();
  const { validatorAddress } = useParams<RewardsParams>();
  const pathValidator = `${paths.staking.prefix}${paths.staking.validators}/${validatorAddress}`;

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathValidator } }), [
    layoutDispatch,
    pathValidator,
  ]);

  const { handleError } = useError();
  const { getConfig, getAddress, getQueryClient, withdrawRewards } = useSdk();
  const config = getConfig();
  const delegatorAddress = getAddress();
  const validator = useStakingValidator(validatorAddress);

  const [rewards, setRewards] = useState<readonly Coin[]>([]);

  useEffect(() => {
    let mounted = true;

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

        if (mounted) setRewards(nonNullRewards);
      } catch {
        // Do nothing because it throws if delegation does not exist, i.e balance = 0
      }
    })();

    return () => {
      mounted = false;
    };
  }, [delegatorAddress, getQueryClient, validatorAddress]);

  async function submitWithdrawRewards() {
    setLoading(layoutDispatch, "Withdrawing rewards...");

    try {
      await withdrawRewards(validatorAddress);

      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("withdrawSuccess"),
          customButtonText: t("validatorHome"),
          customButtonActionPath: pathValidator,
        },
      });
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(layoutDispatch, false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("withdrawFail"),
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

  return (
    <Stack gap="s6">
      <Stack>
        <Title>{t("pendingRewards")}</Title>
        <Title level={2}>{validator?.description?.moniker ?? ""}</Title>
      </Stack>
      {rewards.length ? (
        <>
          <DataList {...getRewardsMap()} />
          <Button type="primary" onClick={submitWithdrawRewards}>
            {t("withdrawRewards")}
          </Button>
        </>
      ) : (
        <Text>{t("noRewardsFound")}</Text>
      )}
    </Stack>
  );
}
