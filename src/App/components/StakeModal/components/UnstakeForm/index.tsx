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
import { StakedResponse, StakingContract } from "utils/staking";
import { getTimeFromSeconds } from "utils/ui";
import * as Yup from "yup";

import { BoldText, CurrentDataStack, FormStack, UnstakeFields } from "./style";

const { Text } = Typography;

const removeStakeTokensLabel = "Amount to unstake";
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

  const [stakedTokens, setStakedTokens] = useState<StakedResponse>();
  const [votingPower, setVotingPower] = useState(0);
  const [liquidToUnstake, setLiquidToUnstake] = useState("");
  const [unstakeTime, setUnstakeTime] = useState("");

  useEffect(() => {
    (async function () {
      try {
        if (!signingClient || !address) return;

        const stakingContract = new StakingContract(config, signingClient);
        const nativeStakedTokens = await stakingContract.getStakedTokens(address);
        const stakedTokens = {
          liquid: nativeCoinToDisplay(nativeStakedTokens.liquid, config.coinMap),
          vesting: nativeCoinToDisplay(nativeStakedTokens.vesting, config.coinMap),
        };
        setStakedTokens(stakedTokens);

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
      const nativeAmount = displayAmountToNative(liquidToUnstake, config.coinMap, config.feeToken);
      const txHash = await stakingContract.unstake(address, {
        denom: config.feeToken,
        amount: nativeAmount,
      });

      const feeTokenDenom = config.coinMap[config.feeToken]?.denom ?? "TGD";
      setTxResult({
        msg: `Successfully unstaked ${liquidToUnstake ?? "0"} ${feeTokenDenom}. Transaction ID: ${txHash}`,
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
      .positive("Tokens must be a positive numbers"),
  });

  async function updatePotentialVotingPower(
    isValid: boolean,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
    target: EventTarget & HTMLInputElement,
  ) {
    const tokensRemove = target.value.trim();
    setLiquidToUnstake(tokensRemove);

    if (!signingClient || !address || !isValid) return;

    const validtokensRemove = isNaN(Number(tokensRemove)) ? "0" : Number(tokensRemove).toString();

    try {
      const nativeAmountRemove = displayAmountToNative(validtokensRemove, config.coinMap, config.feeToken);
      const nativeTokensRemove = { denom: config.feeToken, amount: nativeAmountRemove };

      const stakingContract = new StakingContract(config, signingClient);
      const potentialVotingPower = await stakingContract.getPotentialVotingPower(
        address,
        undefined,
        nativeTokensRemove,
      );
      console.log({ potentialVotingPower });
      const fixedPotentialPower = potentialVotingPower.toFixed(3);
      if (fixedPotentialPower === "0.000" && validtokensRemove === "0") {
        return setFieldValue(getFormItemName(potentialVotingPowerLabel), "0%");
      }
      if (fixedPotentialPower === "0.000") {
        return setFieldValue(getFormItemName(potentialVotingPowerLabel), "~ 0.001%");
      }

      setFieldValue(getFormItemName(potentialVotingPowerLabel), `${fixedPotentialPower}%`);
    } catch {
      setFieldValue(getFormItemName(potentialVotingPowerLabel), "0%");
    }
  }

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
                <CurrentDataStack>
                  <Text>
                    Your voting power is <BoldText>{votingPower.toFixed(3)}%</BoldText>.
                  </Text>
                  <Text>
                    You have staked{" "}
                    <BoldText>
                      {`${stakedTokens?.liquid.amount ?? 0} ${stakedTokens?.liquid.denom ?? "tokens"}`}
                    </BoldText>{" "}
                    as liquid and{" "}
                    <BoldText>
                      {`${stakedTokens?.vesting.amount ?? 0} ${stakedTokens?.vesting.denom ?? "tokens"}`}
                    </BoldText>{" "}
                    as vested.
                  </Text>
                </CurrentDataStack>
                <UnstakeFields>
                  <Field
                    label={removeStakeTokensLabel}
                    placeholder="0.0"
                    value={liquidToUnstake}
                    onInputChange={async ({ target }) =>
                      await updatePotentialVotingPower(isValid, setFieldValue, target)
                    }
                  />
                  <Field label={potentialVotingPowerLabel} placeholder="0%" disabled />
                </UnstakeFields>
                <Text>
                  The withdrawal will be made from your liquid staked tokens first. Only when no liquid tokens
                  are staked will vested tokens be withdrawn.
                </Text>
                {unstakeTime ? <Text>Your withdrawn tokens will be frozen for {unstakeTime}.</Text> : null}
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
