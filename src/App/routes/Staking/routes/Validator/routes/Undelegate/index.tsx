import { Coin } from "@cosmjs/launchpad";
import { Typography } from "antd";
import { Stack } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useError, useSdk } from "service";
import { useLayout } from "service/layout";
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
  const history = useHistory();
  const { url: pathUndelegateMatched } = useRouteMatch();
  const { validatorAddress } = useParams<UndelegateParams>();
  const pathValidator = `${paths.staking.prefix}${paths.staking.validators}/${validatorAddress}`;
  const backButtonProps = useMemo(() => ({ path: pathValidator }), [pathValidator]);
  const { setLoading } = useLayout({ backButtonProps });

  const { handleError } = useError();
  const { getConfig, undelegateTokens } = useSdk();
  const validator = useStakingValidator(validatorAddress);

  async function submitUndelegateBalance({ amount }: FormUndelegateBalanceFields) {
    setLoading("Undelegating...");
    const config = getConfig();

    try {
      const nativeAmountString = displayAmountToNative(amount, config.coinMap, config.stakingToken);
      const undelegateAmount: Coin = { amount: nativeAmountString, denom: config.stakingToken };

      await undelegateTokens(validatorAddress, undelegateAmount);

      const denom = config.coinMap[config.stakingToken].denom;
      setLoading(false);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("undelegateSuccess", { amount, denom }),
          customButtonText: t("validatorHome"),
          customButtonActionPath: pathValidator,
        },
      });
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(false);

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

  return (
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
  );
}
