import { Coin } from "@cosmjs/launchpad";
import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { Stack } from "App/components/layout";
import { DataList } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { ComponentProps, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useSdk } from "service";
import { useLayout } from "service/layout";
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
  const backButtonProps = useMemo(() => ({ path: pathValidators }), []);
  useLayout({ backButtonProps });

  const { getConfig, getAddress, getQueryClient } = useSdk();
  const config = getConfig();
  const validator = useStakingValidator(validatorAddress);

  const [stakedTokens, setStakedTokens] = useState<Decimal>(Decimal.fromUserInput("0", 0));

  useEffect(() => {
    let mounted = true;

    (async function updateStakedTokens() {
      try {
        const { delegationResponse } = await getQueryClient().staking.unverified.delegation(
          getAddress(),
          validatorAddress,
        );
        const stakedTokens = Decimal.fromAtomics(
          delegationResponse?.balance?.amount || "0",
          config.coinMap[config.stakingToken].fractionalDigits,
        );

        if (mounted) setStakedTokens(stakedTokens);
      } catch {
        // Do nothing because it throws if delegation does not exist, i.e balance = 0
      }

      return () => {
        mounted = false;
      };
    })();
  }, [config.coinMap, config.stakingToken, getAddress, getQueryClient, validatorAddress]);

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
  );
}
