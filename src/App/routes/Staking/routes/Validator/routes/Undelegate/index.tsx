import { Coin } from "@cosmjs/launchpad";
import { Typography } from "antd";
import { PageLayout, Stack } from "App/components/layout";
import { Loading } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { displayAmountToNative } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { useStakingValidator } from "utils/staking";
import FormUndelegateBalance, { FormUndelegateBalanceFields } from "./FormUndelegateBalance";

const { Title } = Typography;

interface UndelegateParams {
  readonly validatorAddress: string;
}

export default function Undelegate(): JSX.Element {
  const { t } = useTranslation("staking");
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

      const denom = config.coinMap[config.stakingToken].denom;

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("undelegateSuccess", { amount, denom }),
          customButtonText: t("validatorHome"),
          customButtonActionPath: `${paths.staking.prefix}${paths.staking.validators}/${validatorAddress}`,
        },
      });
    } catch (stackTrace) {
      handleError(stackTrace);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("undelegateFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathUndelegateMatched,
        },
      });
    }
  }

  return loading ? (
    <Loading loadingText={t("undelegating")} />
  ) : (
    <PageLayout
      backButtonProps={{ path: `${paths.staking.prefix}${paths.staking.validators}/${validatorAddress}` }}
    >
      <Stack gap="s6">
        <Stack>
          <Title>{t("undelegate")}</Title>
          <Title level={2}>{validator?.description?.moniker ?? ""}</Title>
        </Stack>
        <FormUndelegateBalance
          validatorAddress={validatorAddress}
          submitUndelegateBalance={submitUndelegateBalance}
        />
      </Stack>
    </PageLayout>
  );
}
