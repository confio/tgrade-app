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
import * as Yup from "yup";

import { BoldText, CurrentData, FormStack, UnstakeFields } from "./style";

const { Text } = Typography;

const addStakeTokensLabel = "Add to staking";
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
  const feeTokenDenom = config.coinMap[config.feeToken].denom;

  const [stakedTokens, setStakedTokens] = useState<Coin>({ denom: feeTokenDenom, amount: "0" });
  const [votingPower, setVotingPower] = useState(0);
  const [tokensAdd, setTokensAdd] = useState("");

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
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, config, handleError, signingClient]);

  async function submitStakeTokens() {
    if (!signingClient || !address) return;

    try {
      const stakingContract = new StakingContract(config, signingClient);
      const nativeAmount = displayAmountToNative(tokensAdd, config.coinMap, config.feeToken);
      const txHash = await stakingContract.stake(address, { denom: config.feeToken, amount: nativeAmount });

      setTxResult({
        msg: `Successfully staked ${tokensAdd}. Transaction ID: ${txHash}`,
      });
      await reloadValidator();
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    }
  }

  const validationSchema = Yup.object().shape({
    [getFormItemName(addStakeTokensLabel)]: Yup.number()
      .typeError("Tokens must be numeric")
      .required("Tokens are required")
      .positive("Tokens must be a positive numbers"),
  });

  async function updatePotentialVotingPower(
    isValid: boolean,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
    target: EventTarget & HTMLInputElement,
  ) {
    const tokensAdd = target.value.trim();
    setTokensAdd(tokensAdd);

    if (!isValid || isNaN(Number(tokensAdd)) || !signingClient || !address) return;

    try {
      const nativeAmountAdd = displayAmountToNative(tokensAdd, config.coinMap, config.feeToken);
      const nativeTokensAdd = { denom: config.feeToken, amount: nativeAmountAdd };

      const stakingContract = new StakingContract(config, signingClient);
      const potentialVotingPower = await stakingContract.getPotentialVotingPower(address, nativeTokensAdd);

      setFieldValue(getFormItemName(potentialVotingPowerLabel), `${potentialVotingPower.toFixed(3)}%`);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }

  return (
    <Stack>
      <Formik
        initialValues={{
          [getFormItemName(addStakeTokensLabel)]: "",
          [getFormItemName(potentialVotingPowerLabel)]: "",
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={() => submitStakeTokens()}
      >
        {({ submitForm, isValid, setFieldValue, isSubmitting }) => (
          <>
            <Form>
              <FormStack gap="s1">
                <CurrentData>
                  <Text>
                    You have staked <BoldText>{`${stakedTokens.amount} ${stakedTokens.denom}`}</BoldText>
                  </Text>
                  <Text>
                    Your voting power is <BoldText>{votingPower.toFixed(3)}%</BoldText>
                  </Text>
                </CurrentData>
                <UnstakeFields>
                  <Field
                    label={addStakeTokensLabel}
                    placeholder="0.0"
                    value={tokensAdd}
                    onInputChange={async ({ target }) =>
                      await updatePotentialVotingPower(isValid, setFieldValue, target)
                    }
                  />
                  <Field label={potentialVotingPowerLabel} placeholder="0%" disabled />
                </UnstakeFields>
                <Button disabled={!isValid} loading={isSubmitting} onClick={() => submitForm()}>
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
