import { Coin } from "@cosmjs/launchpad";
import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { OldPageLayout, Stack } from "App/components/layout";
import { DataList } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { ComponentProps, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { setInitialLayoutState, useLayout, useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { useStakingValidator } from "utils/staking";

const { Title } = Typography;

const pathValidators = `${paths.staking.prefix}${paths.staking.validators}`;

interface DetailParams {
  readonly validatorAddress: string;
}

export default function Detail(): JSX.Element {
  const { t } = useTranslation("staking");

  const history = useHistory();
  const { url: pathValidatorDetailMatched } = useRouteMatch();
  const { validatorAddress } = useParams<DetailParams>();

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathValidators } }), [
    layoutDispatch,
  ]);

  const {
    sdkState: { config, address, queryClient },
  } = useSdk();
  const validator = useStakingValidator(validatorAddress);

  const { data: stakedTokensData } = useQuery("stakedTokens", () =>
    queryClient.staking.unverified.delegation(address, validatorAddress),
  );

  const stakedTokens = Decimal.fromAtomics(
    stakedTokensData?.delegationResponse?.balance?.amount || "0",
    config.coinMap[config.stakingToken].fractionalDigits,
  );

  function getValidatorMap(): ComponentProps<typeof DataList> {
    if (!validator) return {};

    const tokensCoin: Coin = { denom: config.stakingToken, amount: validator.tokens || "0" };
    const tokensAmount = nativeCoinToDisplay(tokensCoin, config.coinMap).amount;
    const tokens = `${tokensAmount} ${config.coinMap[config.stakingToken].denom}`;
    const commissionRate = validator?.commission?.commissionRates?.rate || "0.000000000000000000";
    const commissionPercent = `${commissionRate.slice(0, -16)} %`;

    return {
      Tokens: tokens,
      [t("commission")]: commissionPercent,
      [t("stakedTokens")]: stakedTokens.toString(),
    };
  }

  function goToDelegate() {
    history.push(`${pathValidatorDetailMatched}${paths.staking.delegate}`);
  }

  function goToUndelegate() {
    history.push(`${pathValidatorDetailMatched}${paths.staking.undelegate}`);
  }

  function goToRewards() {
    history.push(`${pathValidatorDetailMatched}${paths.staking.rewards}`);
  }

  return (
    <OldPageLayout>
      <Stack gap="s5">
        <Title>{validator?.description?.moniker ?? ""}</Title>
        <DataList {...getValidatorMap()} />
        <Stack>
          <Button type="primary" onClick={goToDelegate}>
            {t("delegate")}
          </Button>
          <Button type="primary" onClick={goToUndelegate}>
            {t("undelegate")}
          </Button>
          <Button type="primary" onClick={goToRewards}>
            {t("rewards")}
          </Button>
        </Stack>
      </Stack>
    </OldPageLayout>
  );
}
