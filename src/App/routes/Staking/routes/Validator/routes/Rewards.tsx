import { Coin } from "@cosmjs/launchpad";
import { Button, Typography } from "antd";
import { OldPageLayout, Stack } from "App/components/layout";
import { DataList } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { ComponentProps, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { setInitialLayoutState, setLoading, useError, useLayout, useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { useStakingValidator } from "utils/staking";

const { Title, Text } = Typography;

interface MutationVariables {
  readonly validatorAddress: string;
}

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
  const {
    sdkState: { config, address, queryClient, withdrawRewards },
  } = useSdk();
  const validator = useStakingValidator(validatorAddress);

  const { data: rewardsData } = useQuery("rewards", () =>
    queryClient.distribution.unverified.delegationRewards(address, validatorAddress),
  );

  const rewards: readonly Coin[] = rewardsData
    ? rewardsData.rewards
        .map((coin) => ({
          amount: coin.amount ? coin.amount.slice(0, -18) : "",
          denom: coin.denom || "",
        }))
        .filter((coin) => coin.amount.length && coin.denom.length)
    : [];

  async function mutationFn({ validatorAddress }: MutationVariables) {
    await withdrawRewards(validatorAddress);
  }

  const mutationOptions = {
    mutationKey: "withdrawRewards",
    onError: (stackTrace: Error) => {
      handleError(stackTrace);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("withdrawFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathRewardsMatched,
        },
      });
    },
    onSuccess: () => {
      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("withdrawSuccess"),
          customButtonText: t("validatorHome"),
          customButtonActionPath: pathValidator,
        },
      });
    },
    onSettled: () => setLoading(layoutDispatch, false),
  };

  const { mutate } = useMutation(mutationFn, mutationOptions);

  function submitWithdrawRewards() {
    setLoading(layoutDispatch, `${t("withdrawing")}`);
    mutate({ validatorAddress });
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
    <OldPageLayout>
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
    </OldPageLayout>
  );
}
