import { Form, Typography } from "antd";
import Button from "App/components/Button";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { HTMLAttributes } from "react";
import { getFormItemName } from "utils/forms";

const { Text } = Typography;

export const queryAddressLabel = "Address";
export const receiverAddressLabel = "Receiver address";

export interface FormWithdrawRewardsValues {
  readonly queryAddress: string;
  readonly receiverAddress: string;
}

interface WithdrawRewardsFormProps extends FormWithdrawRewardsValues, HTMLAttributes<HTMLOrSVGElement> {
  readonly canWithdraw: boolean;
  readonly address: string | undefined;
  readonly withdrawValidationSchema: any;
  readonly submitWithdrawRewards: (values: FormWithdrawRewardsValues) => void;
  readonly setQueryAddress: (queryAddress: string) => void;
  readonly setReceiverAddress: (receiverAddress: string) => void;
}

export default function WithdrawRewardsForm({
  children,
  canWithdraw,
  address,
  queryAddress,
  setQueryAddress,
  receiverAddress,
  setReceiverAddress,
  withdrawValidationSchema,
  submitWithdrawRewards,
}: WithdrawRewardsFormProps): JSX.Element | null {
  return (
    <Formik
      initialValues={{
        [getFormItemName(queryAddressLabel)]: queryAddress || "",
        [getFormItemName(receiverAddressLabel)]: receiverAddress,
      }}
      enableReinitialize
      validationSchema={withdrawValidationSchema}
      onSubmit={(values) =>
        submitWithdrawRewards({
          queryAddress: values[getFormItemName(queryAddressLabel)],
          receiverAddress: values[getFormItemName(receiverAddressLabel)],
        })
      }
    >
      {({ submitForm, isValid, isSubmitting }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field
                label={queryAddressLabel}
                placeholder="Enter query address"
                value={queryAddress}
                onInputChange={({ target }) => {
                  setQueryAddress(target.value);
                }}
              />
              {children}
              {address ? (
                <>
                  <Field
                    label={receiverAddressLabel}
                    placeholder="Enter receiver address"
                    value={receiverAddress}
                    onInputChange={({ target }) => {
                      setReceiverAddress(target.value);
                    }}
                  />
                  <Button
                    disabled={!isValid || isSubmitting || !canWithdraw}
                    onClick={() => submitForm()}
                    style={{ alignSelf: "flex-start" }}
                  >
                    <div>Withdraw rewards</div>
                  </Button>
                </>
              ) : (
                <Text style={{ textAlign: "left" }}>You need an address in order to withdraw funds</Text>
              )}
            </Stack>
          </Form>
        </>
      )}
    </Formik>
  );
}
