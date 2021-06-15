import { Coin } from "@cosmjs/stargate";
import { Typography } from "antd";
import { OldPageLayout, Stack } from "App/components/layout";
import { paths } from "App/paths";
import * as React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { setInitialLayoutState, setLoading, useError, useLayout, useSdk } from "service";
import { displayAmountToNative } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { useStakingValidator } from "utils/staking";
import FormUndelegateTokens, { FormUndelegateTokensFields } from "./FormUndelegateTokens";

const { Title } = Typography;

interface MutationVariables {
  readonly denomToDisplay: string;
  readonly amountToDisplay: string;
  readonly coinToUndelegate: Coin;
}

interface UndelegateParams {
  readonly validatorAddress: string;
}

export default function Undelegate(): JSX.Element {
  const { t } = useTranslation("staking");

  const history = useHistory();
  const { url: pathUndelegateMatched } = useRouteMatch();
  const { validatorAddress } = useParams<UndelegateParams>();
  const pathValidator = `${paths.staking.prefix}${paths.staking.validators}/${validatorAddress}`;

  const { layoutDispatch } = useLayout();
  useEffect(() => setInitialLayoutState(layoutDispatch, { backButtonProps: { path: pathValidator } }), [
    layoutDispatch,
    pathValidator,
  ]);

  const { handleError } = useError();
  const {
    sdkState: { config, signingClient, address },
  } = useSdk();
  const validator = useStakingValidator(validatorAddress);

  async function mutationFn({ coinToUndelegate }: MutationVariables) {
    await signingClient.undelegateTokens(address, validatorAddress, coinToUndelegate);
  }

  const mutationOptions = {
    mutationKey: "undelegateTokens",
    onError: (stackTrace: Error) => {
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
    },
    onSuccess: (_: void, { amountToDisplay: amount, denomToDisplay: denom }: MutationVariables) => {
      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("undelegateSuccess", { amount, denom }),
          customButtonText: t("validatorHome"),
          customButtonActionPath: pathValidator,
        },
      });
    },
    onSettled: () => setLoading(layoutDispatch, false),
  };

  const { mutate } = useMutation(mutationFn, mutationOptions);

  function submitUndelegateBalance({ amount: amountToDisplay }: FormUndelegateTokensFields) {
    setLoading(layoutDispatch, `${t("undelegating")}`);

    try {
      const denomToDisplay = config.coinMap[config.stakingToken].denom;
      const nativeAmountString = displayAmountToNative(amountToDisplay, config.coinMap, config.stakingToken);
      const coinToUndelegate: Coin = { amount: nativeAmountString, denom: config.stakingToken };

      mutate({ denomToDisplay, amountToDisplay, coinToUndelegate });
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(layoutDispatch, false);
    }
  }

  return (
    <OldPageLayout>
      <Stack gap="s6">
        <Stack>
          <Title>{t("undelegate")}</Title>
          <Title level={2}>{validator?.description?.moniker ?? ""}</Title>
        </Stack>
        <FormUndelegateTokens
          validatorAddress={validatorAddress}
          submitUndelegateTokens={submitUndelegateBalance}
        />
      </Stack>
    </OldPageLayout>
  );
}
