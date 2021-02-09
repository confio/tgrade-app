import { Coin } from "@cosmjs/launchpad";
import { Decimal } from "@cosmjs/math";
import { Button, Typography } from "antd";
import { PageLayout } from "App/components/layout";
import { DataList } from "App/components/logic";
import { pathDelegate, pathRewards, pathStaking, pathUndelegate, pathValidators } from "App/paths";
import * as React from "react";
import { ComponentProps, useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { useStakingValidator } from "utils/staking";
import { ButtonStack, MainStack } from "./style";

const { Title } = Typography;

interface DetailParams {
  readonly validatorAddress: string;
}

export default function Detail(): JSX.Element {
  const { url: pathValidatorDetailMatched } = useRouteMatch();
  const history = useHistory();
  const { validatorAddress } = useParams<DetailParams>();
  const validator = useStakingValidator(validatorAddress);

  const { getConfig, getStakingClient, getAddress } = useSdk();
  const config = getConfig();
  const [balance, setBalance] = useState<Decimal>(Decimal.fromUserInput("0", 0));

  useEffect(() => {
    (async function updateBalance() {
      try {
        const { delegationResponse } = await getStakingClient().staking.unverified.delegation(
          getAddress(),
          validatorAddress,
        );
        const balance = Decimal.fromAtomics(
          delegationResponse?.balance?.amount || "0",
          config.coinMap[config.stakingToken].fractionalDigits,
        );

        setBalance(balance);
      } catch {
        // Do nothing because it throws if delegation does not exist, i.e balance = 0
      }
    })();
  }, [config.coinMap, config.stakingToken, getAddress, getStakingClient, validatorAddress]);

  function getValidatorMap(): ComponentProps<typeof DataList> {
    if (!validator) return {};

    const tokensCoin: Coin = { denom: config.stakingToken, amount: validator.tokens || "0" };
    const tokensAmount = nativeCoinToDisplay(tokensCoin, config.coinMap).amount;
    const tokens = `${tokensAmount} ${config.coinMap[config.stakingToken].denom}`;
    const commissionRate = validator?.commission?.commissionRates?.rate || "0.000000000000000000";
    const commissionPercent = `${commissionRate.slice(0, -16)} %`;

    return {
      Tokens: tokens,
      Commission: commissionPercent,
      Balance: balance.toString(),
    };
  }

  function goToDelegate() {
    history.push(`${pathValidatorDetailMatched}${pathDelegate}`);
  }

  function goToUndelegate() {
    history.push(`${pathValidatorDetailMatched}${pathUndelegate}`);
  }

  function goToRewards() {
    history.push(`${pathValidatorDetailMatched}${pathRewards}`);
  }

  return (
    <PageLayout backButtonProps={{ path: `${pathStaking}${pathValidators}` }}>
      <MainStack>
        <Title>{validator?.description?.moniker ?? ""}</Title>
        <DataList {...getValidatorMap()} />
        <ButtonStack>
          <Button type="primary" onClick={goToDelegate}>
            Delegate
          </Button>
          <Button type="primary" onClick={goToUndelegate}>
            Undelegate
          </Button>
          <Button type="primary" onClick={goToRewards}>
            Rewards
          </Button>
        </ButtonStack>
      </MainStack>
    </PageLayout>
  );
}
