import { Decimal } from "@cosmjs/math";
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
import * as Yup from "yup";

import { BoldText, CurrentDataStack, FormStack, StakeFields } from "./style";

const { Text } = Typography;

const liquidStakeTokensLabel = "Liquid amount to stake";
const vestingStakeTokensLabel = "Vesting amount to stake";
const potentialVotingPowerLabel = "Potential voting power";

interface StakeFormProps {
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
  readonly reloadValidator: () => Promise<void>;
}

export default function StakeForm({ setTxResult, reloadValidator }: StakeFormProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, address, signingClient },
  } = useSdk();

  const [stakedTokens, setStakedTokens] = useState<StakedResponse>();
  const [votingPower, setVotingPower] = useState(0);
  const [liquidToStake, setLiquidToStake] = useState("");
  const [vestingToStake, setVestingToStake] = useState("");
  const [potentialVotingPower, setPotentialVotingPower] = useState("0%");

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
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, config, handleError, signingClient]);

  useEffect(() => {
    (async function () {
      if (!address || !signingClient) return;

      const feeTokenDecimals = config.coinMap[config.feeToken]?.fractionalDigits ?? 0;
      const validLiquidToStake =
        !liquidToStake || isNaN(Number(liquidToStake)) ? "0" : Number(liquidToStake).toString();
      const validVestingToStake =
        !vestingToStake || isNaN(Number(vestingToStake)) ? "0" : Number(vestingToStake).toString();

      try {
        const decimalLiquid = Decimal.fromUserInput(validLiquidToStake, feeTokenDecimals);
        const decimalVesting = Decimal.fromUserInput(validVestingToStake, feeTokenDecimals);
        const decimalSum = decimalLiquid.plus(decimalVesting).toString();
        const coinToStake = { denom: config.feeToken, amount: decimalSum };

        const stakingContract = new StakingContract(config, signingClient);
        const potentialVotingPower = await stakingContract.getPotentialVotingPower(address, coinToStake);
        const fixedPotentialPower = potentialVotingPower.toFixed(3);
        if (fixedPotentialPower === "0.000" && validLiquidToStake === "0" && validVestingToStake === "0") {
          return setPotentialVotingPower("0%");
        }
        if (fixedPotentialPower === "0.000") return setPotentialVotingPower("~ 0.001%");

        setPotentialVotingPower(`${fixedPotentialPower}%`);
      } catch {
        setPotentialVotingPower("0%");
      }
    })();
  }, [address, config, handleError, liquidToStake, signingClient, vestingToStake]);

  async function submitStakeTokens() {
    if (!signingClient || !address) return;

    try {
      const stakingContract = new StakingContract(config, signingClient);
      const nativeLiquidToStake = displayAmountToNative(liquidToStake, config.coinMap, config.feeToken);
      const nativeVestingToStake = displayAmountToNative(vestingToStake, config.coinMap, config.feeToken);
      const txHash = await stakingContract.stake(address, {
        liquid: { denom: config.feeToken, amount: nativeLiquidToStake },
        vesting: { denom: config.feeToken, amount: nativeVestingToStake },
      });

      const feeTokenDenom = config.coinMap[config.feeToken]?.denom ?? "TGD";
      setTxResult({
        msg: `Successfully staked ${liquidToStake ? liquidToStake : "0"} ${feeTokenDenom} as liquid and ${
          vestingToStake ? vestingToStake : "0"
        } ${feeTokenDenom} as vesting. Transaction ID: ${txHash}`,
      });
      await reloadValidator();
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    }
  }

  const validationSchema = Yup.object().shape({
    [getFormItemName(liquidStakeTokensLabel)]: Yup.number()
      .typeError("Tokens must be numeric")
      .required("Tokens are required")
      .positive("Tokens must be a positive numbers"),
    [getFormItemName(vestingStakeTokensLabel)]: Yup.number()
      .typeError("Tokens must be numeric")
      .positive("Tokens must be a positive numbers"),
  });

  const fixedVotingPower = votingPower.toFixed(3);
  const isSmallVotingPower = fixedVotingPower === "0.000" && votingPower !== 0;
  const votingPowerStr = isSmallVotingPower ? "~ 0.001" : fixedVotingPower;

  return (
    <Stack>
      <Formik
        initialValues={{
          [getFormItemName(liquidStakeTokensLabel)]: "",
          [getFormItemName(potentialVotingPowerLabel)]: "",
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={() => submitStakeTokens()}
      >
        {({ submitForm, isValid, isSubmitting }) => (
          <>
            <Form>
              <FormStack gap="s1">
                <CurrentDataStack>
                  <Text>
                    Your voting power is <BoldText>{votingPowerStr}%</BoldText>.
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
                <StakeFields>
                  <div>
                    <Field
                      label={liquidStakeTokensLabel}
                      placeholder="0.0"
                      value={liquidToStake}
                      onInputChange={({ target }) => setLiquidToStake(target.value.trim())}
                    />
                    <Field
                      label={vestingStakeTokensLabel}
                      placeholder="0.0"
                      value={vestingToStake}
                      onInputChange={({ target }) => setVestingToStake(target.value.trim())}
                    />
                  </div>
                  <Field
                    label={potentialVotingPowerLabel}
                    value={potentialVotingPower}
                    placeholder="0%"
                    disabled
                  />
                </StakeFields>
                <Button
                  disabled={!isValid || !liquidToStake}
                  loading={isSubmitting}
                  onClick={() => submitForm()}
                >
                  <div>Stake tokens</div>
                </Button>
              </FormStack>
            </Form>
          </>
        )}
      </Formik>
    </Stack>
  );
}
