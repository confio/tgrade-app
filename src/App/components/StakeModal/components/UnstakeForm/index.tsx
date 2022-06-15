import { Coin } from "@cosmjs/stargate";
import { Typography } from "antd";
import Button from "App/components/Button";
import Field from "App/components/Field";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { displayAmountToNative, nativeCoinToDisplay } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { getFormItemName } from "utils/forms";
import { StakingContract } from "utils/staking";
import { getTimeFromSeconds } from "utils/ui";
import * as Yup from "yup";

import { BoldText, CurrentData, FormStack, UnstakeFields } from "./style";

const { Text } = Typography;

const removeStakeTokensLabel = "Withdraw from staking";
const potentialVotingPowerLabel = "Potential voting power";

interface UnstakeFormProps {
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
  readonly reloadValidator: () => Promise<void>;
}

export default function UnstakeForm({ setTxResult, reloadValidator }: UnstakeFormProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, address, signingClient },
  } = useSdk();
  const feeTokenDenom = config.coinMap[config.feeToken].denom;

  const [stakedTokens, setStakedTokens] = useState<Coin>({ denom: feeTokenDenom, amount: "0" });
  const [votingPower, setVotingPower] = useState(0);
  const [tokensRemove, setTokensRemove] = useState("");
  const [unstakeTime, setUnstakeTime] = useState("");

  useEffect(() => {
    (async function () {
      try {
        if (!signingClient || !address) return;

        const stakingContract = new StakingContract(config, signingClient);
        const nativeStakedCoin = await stakingContract.getStakedTokens(address);
        const prettyStakedCoin = nativeCoinToDisplay(nativeStakedCoin, config.coinMap);
        setStakedTokens(prettyStakedCoin);

        const votingPower = await stakingContract.getVotingPower(address);
        setVotingPower(votingPower);

        const unbondingSeconds = await stakingContract.getUnbondingPeriod();
        const unstakeTime = getTimeFromSeconds(unbondingSeconds);
        setUnstakeTime(unstakeTime);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, config, handleError, signingClient]);

  async function submitUnstakeTokens() {
    if (!signingClient || !address) return;

    try {
      const stakingContract = new StakingContract(config, signingClient);
      const nativeAmount = displayAmountToNative(tokensRemove, config.coinMap, config.feeToken);
      const txHash = await stakingContract.unstake(address, {
        denom: config.feeToken,
        amount: nativeAmount,
      });

      setTxResult({
        msg: `Successfully unstaked ${tokensRemove}. Transaction ID: ${txHash}`,
      });
      await reloadValidator();
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    }
  }

  const validationSchema = Yup.object().shape({
    [getFormItemName(removeStakeTokensLabel)]: Yup.number()
      .typeError("Tokens must be numeric")
      .required("Tokens are required")
      .positive("Tokens must be a positive numbers")
      .max(parseFloat(stakedTokens.amount), "Tokens must be equal or lower than current stake"),
  });

  async function updatePotentialVotingPower(
    isValid: boolean,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
    target: EventTarget & HTMLInputElement,
  ) {
    const tokensRemove = target.value.trim();
    setTokensRemove(tokensRemove);

    if (!signingClient || !address || !isValid || isNaN(Number(tokensRemove))) return;

    try {
      const nativeAmountRemove = displayAmountToNative(tokensRemove, config.coinMap, config.feeToken);
      const nativeTokensRemove = { denom: config.feeToken, amount: nativeAmountRemove };

      const stakingContract = new StakingContract(config, signingClient);
      const potentialVotingPower = await stakingContract.getPotentialVotingPower(
        address,
        undefined,
        nativeTokensRemove,
      );

      const fixedPotentialVotingPower = potentialVotingPower.toFixed(3).toString();
      const validPotentialVotingPower =
        parseFloat(fixedPotentialVotingPower) <= parseFloat("0.000") ? "~ 0.001" : fixedPotentialVotingPower;

      setFieldValue(getFormItemName(potentialVotingPowerLabel), `${validPotentialVotingPower}%`);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }

  const fixedStakedTokens = parseFloat(stakedTokens.amount).toFixed(3);
  const validStakedTokens =
    parseFloat(fixedStakedTokens) <= parseFloat("0.000") ? "~ 0.001" : fixedStakedTokens;

  return (
    <Stack>
      <Formik
        initialValues={{
          [getFormItemName(removeStakeTokensLabel)]: "",
          [getFormItemName(potentialVotingPowerLabel)]: "",
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={() => submitUnstakeTokens()}
      >
        {({ submitForm, isValid, setFieldValue, isSubmitting }) => (
          <>
            <Form>
              <FormStack gap="s1">
                <CurrentData>
                  <Text>
                    You have staked <BoldText>{`${validStakedTokens} ${stakedTokens.denom}`}</BoldText>
                  </Text>
                  <Text>
                    Your voting power is <BoldText>{votingPower.toFixed(3)}%</BoldText>
                  </Text>
                </CurrentData>
                <UnstakeFields>
                  <Field
                    label={removeStakeTokensLabel}
                    placeholder="0.0"
                    value={tokensRemove}
                    onInputChange={async ({ target }) =>
                      await updatePotentialVotingPower(isValid, setFieldValue, target)
                    }
                  />
                  <Field label={potentialVotingPowerLabel} placeholder="0%" disabled />
                </UnstakeFields>
                {unstakeTime ? <Text>Your withdrawn tokens will be frozen for {unstakeTime}</Text> : null}
                <Button disabled={!isValid} loading={isSubmitting} onClick={() => submitForm()}>
                  <div>Unstake tokens</div>
                </Button>
              </FormStack>
            </Form>
          </>
        )}
      </Formik>
    </Stack>
  );
}
