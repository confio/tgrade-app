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
import FormDelegateTokens, { FormDelegateTokensFields } from "./FormDelegateTokens";

const { Title } = Typography;

interface MutationVariables {
  readonly denomToDisplay: string;
  readonly amountToDisplay: string;
  readonly coinToDelegate: Coin;
}

interface DelegateParams {
  readonly validatorAddress: string;
}

export default function Delegate(): JSX.Element {
  const { t } = useTranslation("staking");

  const history = useHistory();
  const { url: pathDelegateMatched } = useRouteMatch();
  const { validatorAddress } = useParams<DelegateParams>();
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

  async function mutationFn({ coinToDelegate }: MutationVariables) {
    await signingClient.delegateTokens(address, validatorAddress, coinToDelegate);
  }

  const mutationOptions = {
    mutationKey: "delegateTokens",
    onError: (stackTrace: Error) => {
      handleError(stackTrace);

      history.push({
        pathname: paths.operationResult,
        state: {
          success: false,
          message: t("delegateFail"),
          error: getErrorFromStackTrace(stackTrace),
          customButtonActionPath: pathDelegateMatched,
        },
      });
    },
    onSuccess: (_: void, { amountToDisplay: amount, denomToDisplay: denom }: MutationVariables) => {
      history.push({
        pathname: paths.operationResult,
        state: {
          success: true,
          message: t("delegateSuccess", { amount, denom }),
          customButtonText: t("validatorHome"),
          customButtonActionPath: pathValidator,
        },
      });
    },
    onSettled: () => setLoading(layoutDispatch, false),
  };

  const { mutate } = useMutation(mutationFn, mutationOptions);

  function submitDelegateBalance({ amount: amountToDisplay }: FormDelegateTokensFields) {
    setLoading(layoutDispatch, `${t("delegating")}`);

    try {
      const denomToDisplay = config.coinMap[config.stakingToken].denom;
      const nativeAmount = displayAmountToNative(amountToDisplay, config.coinMap, config.stakingToken);
      const coinToDelegate: Coin = { amount: nativeAmount, denom: config.stakingToken };

      mutate({ denomToDisplay, amountToDisplay, coinToDelegate });
    } catch (stackTrace) {
      handleError(stackTrace);
      setLoading(layoutDispatch, false);
    }
  }

  return (
    <OldPageLayout>
      <Stack gap="s6">
        <Stack>
          <Title>{t("delegate")}</Title>
          <Title level={2}>{validator?.description?.moniker ?? ""}</Title>
        </Stack>
        <FormDelegateTokens submitDelegateTokens={submitDelegateBalance} />
      </Stack>
    </OldPageLayout>
  );
}
