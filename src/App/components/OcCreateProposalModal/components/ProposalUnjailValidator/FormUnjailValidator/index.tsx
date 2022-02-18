import { Typography } from "antd";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Checkbox from "App/components/Checkbox";
import { DatePicker } from "App/components/DatePicker";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useState } from "react";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";

import { ButtonGroup, Separator, StyledRadioGroup } from "./style";

const validatorsLabel = "Addresses of validators you want to punish";
const commentLabel = "Comments (these comments are visible on the proposal once people vote on it)";
const slashPortionLabel = "% of stake and engagement points to slash";

export type PunismentKind = "slash" | "jail" | "both";

const validationSchema = Yup.object().shape({
  [getFormItemName(commentLabel)]: Yup.string().typeError("comment should be text").required(),
  [getFormItemName(validatorsLabel)]: Yup.string()
    .typeError("Addresses must be alphanumeric")
    .required("Participants are required"),
  [getFormItemName(slashPortionLabel)]: Yup.number().typeError("Comment must be numeric"),
});

export interface FormPunishValidatorValues {
  readonly validators: string;
  readonly slashPortion: string;
  readonly comment: string;
  readonly jailedUntil: string;
  readonly jailedForever: string;
  readonly punishment: string;
}

interface FormPunishValidatorProps extends FormPunishValidatorValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormPunishValidatorValues) => void;
}

export default function FormUnjailValidator({
  comment,
  validators,
  goBack,
  handleSubmit,
}: FormPunishValidatorProps): JSX.Element {
  const [punishmentType, setPunishmentType] = useState<PunismentKind>("slash");
  const [isJailedForever, setJailedForever] = useState(false);
  const [jailedUntil, setJailedUntil] = useState("");
  const [slashPortion, setSlashPortion] = useState("0");

  const handleDateChange = (d: Date): void => {
    if (!d) return;
    const date = new Date(d).toLocaleDateString("en-GB");
    console.log({ d }, { date });
    setJailedUntil(date);
  };
  const validatorsLabel = "Addresses of validators you want to punish";
  const commentLabel = "Comments (these comments are visible on the proposal once people vote on it)";
  const slashPortionLabel = "% of stake and engagement points to slash";
  const jailForeverLabel = "Jail validator forever";
  return (
    <Formik
      initialValues={{
        [getFormItemName(validatorsLabel)]: validators,
        [getFormItemName(commentLabel)]: comment,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit({
          validators: values[getFormItemName(validatorsLabel)],
          slashPortion: values[getFormItemName(slashPortionLabel)],
          comment: values[getFormItemName(commentLabel)],
          jailedUntil,
          jailedForever: values[getFormItemName(jailForeverLabel)],
          punishment: punishmentType,
        });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <Field label={validatorsLabel} placeholder="Enter address" />

              <StyledRadioGroup
                onChange={({ target }) => {
                  setPunishmentType(target.value);
                }}
                value={punishmentType}
              >
                {/*TODO: figure out of these are actually needed as it is the same call
                <Radio value="slash">Slash</Radio>
                <Radio value="jail">Jail</Radio>
                <Radio value="both">Both</Radio> */}
              </StyledRadioGroup>
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
                <p>Staked: </p>
                <p>Engagement points:</p>
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
