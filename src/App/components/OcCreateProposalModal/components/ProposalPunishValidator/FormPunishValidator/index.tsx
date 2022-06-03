import { Coin } from "@cosmjs/stargate";
import { Typography } from "antd";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Checkbox from "App/components/Checkbox";
import { DatePicker } from "App/components/DatePicker";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { getFormItemName, isValidAddress } from "utils/forms";
import { EngagementContractQuerier } from "utils/poeEngagement";
import { StakingContractQuerier } from "utils/staking";
import * as Yup from "yup";

import { ButtonGroup, Separator } from "./style";

const validatorLabel = "Address of the validator you want to punish";
const commentLabel = "Comment";
const slashPortionLabel = "% of stake and distributed points to slash";
const jailForeverLabel = "Jail validator forever";

const validationSchema = Yup.object().shape({
  [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
  [getFormItemName(validatorLabel)]: Yup.string()
    .typeError("Address must be alphanumeric")
    .required("Validator address is required"),
  [getFormItemName(slashPortionLabel)]: Yup.number().typeError("Slashed portion must be numeric"),
});

export interface FormPunishValidatorValues {
  readonly validator: string;
  readonly slashPortion: string;
  readonly comment: string;
  readonly jailedUntil: string;
  readonly jailedForever: string;
}

interface FormPunishValidatorProps extends FormPunishValidatorValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormPunishValidatorValues) => void;
}

export default function FormPunishValidator({
  comment,
  validator,
  goBack,
  handleSubmit,
}: FormPunishValidatorProps): JSX.Element {
  const {
    sdkState: { config, client },
  } = useSdk();

  const [isJailedForever, setJailedForever] = useState(false);
  const [jailedUntil, setJailedUntil] = useState("");
  const [slashPortion, setSlashPortion] = useState("0");

  const [validatorAddress, setValidatorAddress] = useState("");
  const [staked, setStaked] = useState<Coin>();
  const [distributedPoints, setDistributedPoints] = useState<number>();

  useEffect(() => {
    (async function () {
      if (!client || !validatorAddress || !isValidAddress(validatorAddress, config.addressPrefix)) return;

      try {
        const stakingContract = new StakingContractQuerier(config, client);
        const nativeStakedCoin = await stakingContract.getStakedTokens(validatorAddress);
        const prettyStakedCoin = nativeCoinToDisplay(nativeStakedCoin, config.coinMap);
        setStaked(prettyStakedCoin);

        const egContract = new EngagementContractQuerier(config, PoEContractType.DISTRIBUTION, client);
        const distributedPoints = await egContract.getEngagementPoints(validatorAddress);
        setDistributedPoints(distributedPoints);
      } catch {
        setStaked(undefined);
        setDistributedPoints(undefined);
      }
    })();
  }, [client, config, validatorAddress]);

  const handleDateChange = (d: Date): void => {
    if (!d) return;
    const date = new Date(d).toLocaleDateString("en-GB");
    setJailedUntil(date);
  };

  return (
    <Formik
      initialValues={{
        [getFormItemName(validatorLabel)]: validator,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit({
          validator: values[getFormItemName(validatorLabel)],
          slashPortion: values[getFormItemName(slashPortionLabel)],
          comment: values[getFormItemName(commentLabel)],
          jailedUntil,
          jailedForever: values[getFormItemName(jailForeverLabel)],
        });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field
                label={validatorLabel}
                placeholder="Enter address"
                value={validatorAddress}
                onInputChange={({ target }) => {
                  setValidatorAddress(target.value);
                }}
              />
              <div style={{ width: "40%" }}>
                <Field
                  units="%"
                  label={slashPortionLabel}
                  placeholder="Type"
                  value={slashPortion}
                  onInputChange={({ target }) => {
                    setSlashPortion(target.value);
                  }}
                />
                {staked ? (
                  <p>
                    Staked: {staked.amount} {staked.denom}
                  </p>
                ) : null}
                {distributedPoints ? <p>Distributed points: {distributedPoints}</p> : null}
              </div>
              <Typography>Jailed until:</Typography>
              <div style={{ display: "flex", alignItems: "center" }}>
                <DatePicker onChange={(d) => handleDateChange(d)} disabled={isJailedForever} />
                <Checkbox
                  onChange={() => setJailedForever((isJailedForever) => !isJailedForever)}
                  style={{ marginLeft: "20px" }}
                  name={getFormItemName(jailForeverLabel)}
                >
                  <Typography>Jail Forever</Typography>
                </Checkbox>
              </div>
              <Field label={commentLabel} placeholder="Enter comment" />
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button disabled={!isValid} onClick={() => submitForm()}>
                  <div>Create proposal</div>
                </Button>
              </ButtonGroup>
            </Stack>
          </Form>
        </>
      )}
    </Formik>
  );
}
