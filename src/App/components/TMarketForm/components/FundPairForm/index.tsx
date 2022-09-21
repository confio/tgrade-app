import { Typography } from "antd";
import Button from "App/components/Button";
import Field from "App/components/Field";
import { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { getFormItemName } from "utils/forms";
import { Pair, PoolContract, TokenHuman } from "utils/tokens";
import * as Yup from "yup";

const { Text } = Typography;

export interface FundPairFormValues {
  readonly tokenFromAmount: string;
  readonly tokenToAmount: string;
}

interface FundPairFormProps {
  readonly tokenFrom: TokenHuman;
  readonly tokenTo: TokenHuman;
  readonly pair: Pair;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export function FundPairForm({ tokenFrom, tokenTo, pair, setTxResult }: FundPairFormProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, address, signingClient },
  } = useSdk();

  const validationSchema = Yup.object().shape({
    [getFormItemName(tokenFrom.symbol)]: Yup.number()
      .typeError("Amount must be numeric")
      .required("Amount is required")
      .positive("Amount must be positive")
      .test(`is-lower-than-balance`, `Amount must be lower than your balance`, (amount) => {
        return !amount || Number(tokenFrom.humanBalance) > amount;
      }),
    [getFormItemName(tokenTo.symbol)]: Yup.number()
      .typeError("Amount must be numeric")
      .required("Amount is required")
      .positive("Amount must be positive")
      .test(`is-lower-than-balance`, `Amount must be lower than your balance`, (amount) => {
        return !amount || Number(tokenTo.humanBalance) > amount;
      }),
  });

  async function submitFundPair({ tokenFromAmount, tokenToAmount }: FundPairFormValues) {
    if (!signingClient || !address) return;

    try {
      const txHash = await PoolContract.ProvideLiquidity(
        signingClient,
        pair.contract_addr,
        address,
        {
          assetA: tokenFromAmount,
          assetB: tokenToAmount,
          selectFrom: tokenFrom,
          selectTo: tokenTo,
        },
        config.gasPrice,
      );
      setTxResult({
        msg: `Successfully provided liquidity to pair ${tokenFrom.symbol} ⇄ ${tokenTo.symbol} (${pair.contract_addr}). Transaction ID: ${txHash}`,
      });
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    }
  }

  return (
    <div>
      <Text>
        The pair needs to have some liquidity before operating with it. By providing some you will also
        accumulate liquidity tokens associated to this pair.
      </Text>
      <Formik
        initialValues={{
          [getFormItemName(tokenFrom.symbol)]: "",
          [getFormItemName(tokenTo.symbol)]: "",
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) =>
          submitFundPair({
            tokenFromAmount: values[getFormItemName(tokenFrom.symbol)],
            tokenToAmount: values[getFormItemName(tokenTo.symbol)],
          })
        }
      >
        {({ submitForm, isValid, isSubmitting }) => (
          <Form>
            <Stack gap="s1">
              <div>
                <Text>You will provide</Text>
                <Field label={tokenFrom.symbol} placeholder="Enter amount" />
                <Text>and</Text>
                <Field label={tokenTo.symbol} placeholder="Enter amount" />
              </div>
              <Button onClick={submitForm} loading={isSubmitting} disabled={!isValid}>
                Fund pair
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </div>
  );
}
