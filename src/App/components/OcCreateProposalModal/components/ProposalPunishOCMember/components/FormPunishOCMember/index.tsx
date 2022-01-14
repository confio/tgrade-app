import { Decimal } from "@cosmjs/math";
import { Typography } from "antd";
import AddressList from "App/components/AddressList";
import BackButtonOrLink from "App/components/BackButtonOrLink";
import Button from "App/components/Button";
import Checkbox from "App/components/Checkbox";
import Field from "App/components/Field";
import Stack from "App/components/Stack/style";
import { Formik } from "formik";
import { Form } from "formik-antd";
import { useEffect, useState } from "react";
import { useOc, useSdk } from "service";
import { DsoContractQuerier } from "utils/dso";
import { addressStringToArray, getFormItemName, isValidAddress } from "utils/forms";
import * as Yup from "yup";

import { ButtonGroup, MemberTexts, PunishmentRow, Separator } from "./style";

const { Text } = Typography;

const memberToPunishLabel = "Member to be punished";
const slashingPercentageLabel = "% of escrow to be slashed";
const kickOutLabel = "Kick out from Trusted Circle";
const distributionListLabel = "Distribution list for slashed escrow";
const commentLabel = "Comment";

export interface FormPunishOCMemberValues {
  readonly memberToPunish: string;
  readonly memberEscrow: string;
  readonly slashingPercentage: string;
  readonly kickOut: boolean;
  readonly distributionList: readonly string[];
  readonly comment: string;
}

interface FormPunishOCMemberProps extends Omit<FormPunishOCMemberValues, "memberEscrow"> {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormPunishOCMemberValues) => void;
}

export default function FormPunishOCMember({
  memberToPunish,
  slashingPercentage,
  kickOut,
  distributionList,
  comment,
  goBack,
  handleSubmit,
}: FormPunishOCMemberProps): JSX.Element {
  const {
    sdkState: { config, client },
  } = useSdk();
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";
  const {
    ocState: { ocAddress },
  } = useOc();

  // NOTE: Have local state for these because otherwise when entering
  //       the distribution list the form resets and wipes the fields
  const [memberToPunishInit, setMemberToPunishInit] = useState(memberToPunish);
  const [memberEscrowInit, setMemberEscrowInit] = useState("0");
  const [slashingPercentageInit, setSlashingPercentageInit] = useState(slashingPercentage);
  const [kickOutInit, setKickOutInit] = useState(kickOut);
  const [commentInit, setCommentInit] = useState(comment);

  const [distributionListString, setDistributionListString] = useState(distributionList.join(","));
  const [distributionListArray, setDistributionListArray] = useState(distributionList);

  useEffect(() => {
    (async function updateMemberEscrow() {
      if (!ocAddress || !client || !memberToPunishInit) return;

      if (!isValidAddress(memberToPunishInit, config.addressPrefix)) {
        setMemberEscrowInit("0");
        return;
      }

      const dsoContract = new DsoContractQuerier(ocAddress, client);

      try {
        const escrowResponse = await dsoContract.getEscrow(memberToPunishInit);
        if (!escrowResponse) throw new Error("No escrow found for user");

        const decimals = config.coinMap[config.feeToken].fractionalDigits;
        const userEscrowDecimal = Decimal.fromAtomics(escrowResponse.paid, decimals);
        setMemberEscrowInit(userEscrowDecimal.toString());
      } catch {
        setMemberEscrowInit("0");
      }
    })();
  }, [client, config.addressPrefix, config.coinMap, config.feeToken, memberToPunishInit, ocAddress]);

  useEffect(() => {
    const distributionListArray = addressStringToArray(distributionListString);
    setDistributionListArray(distributionListArray);
  }, [distributionListString]);

  const validationSchema = Yup.object().shape({
    [getFormItemName(memberToPunishLabel)]: Yup.string()
      .typeError("Member address must be alphanumeric")
      .required("Member address is required")
      .test(
        "is-address-valid",
        "Member address must be valid",
        (dsoAddress) => !dsoAddress || isValidAddress(dsoAddress, config.addressPrefix),
      ),
    [getFormItemName(slashingPercentageLabel)]: Yup.number()
      .typeError("Slashing percentage must be a number")
      .min(0, "Slashing percentage must be between 0 and 100")
      .max(100, "Slashing percentage must be between 0 and 100")
      .when(getFormItemName(kickOutLabel), (kickOut: boolean, schema: any) => {
        return schema.test({
          test: (slashingPercentage?: number) => kickOut || slashingPercentage,
          message: "Slashing percentage is required when not kicking out",
        });
      }),
    [getFormItemName(distributionListLabel)]: Yup.string().typeError("Addresses must be alphanumeric"),
    [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
  });

  return (
    <Formik
      initialValues={{
        [getFormItemName(memberToPunishLabel)]: memberToPunishInit,
        [getFormItemName(slashingPercentageLabel)]: slashingPercentageInit,
        [getFormItemName(kickOutLabel)]: kickOutInit,
        [getFormItemName(distributionListLabel)]: distributionListString,
        [getFormItemName(commentLabel)]: commentInit,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const slashingPercentage = values[getFormItemName(slashingPercentageLabel)].toString();
        const distributionList =
          !slashingPercentage || slashingPercentage === "0" ? [] : distributionListArray;

        handleSubmit({
          memberToPunish: values[getFormItemName(memberToPunishLabel)].toString(),
          memberEscrow: memberEscrowInit,
          slashingPercentage,
          kickOut: !!values[getFormItemName(kickOutLabel)],
          distributionList,
          comment: values[getFormItemName(commentLabel)].toString(),
        });
      }}
    >
      {({ isValid, submitForm }) => (
        <>
          <Form>
            <Stack gap="s1">
              <PunishmentRow>
                <Field
                  label={memberToPunishLabel}
                  placeholder="Enter address"
                  value={memberToPunishInit}
                  onInputChange={({ target }) => {
                    setMemberToPunishInit(target.value);
                  }}
                />
                <Checkbox
                  name={getFormItemName(kickOutLabel)}
                  value={kickOutInit}
                  onChange={({ target }) => {
                    setKickOutInit(target.checked);
                  }}
                >
                  {kickOutLabel}
                </Checkbox>
              </PunishmentRow>
              <PunishmentRow>
                <Field
                  label={slashingPercentageLabel}
                  placeholder="Enter percentage"
                  units="%"
                  optional
                  tooltip="Percentage escrow that will be removed from the member's account"
                  value={slashingPercentageInit}
                  onInputChange={({ target }) => {
                    setSlashingPercentageInit(target.value);
                  }}
                />
                <MemberTexts>
                  <Text>Member's escrow</Text>
                  {memberEscrowInit === "0" ? (
                    <Text
                      style={{ color: "var(--color-error-form)" }}
                    >{`${memberEscrowInit} ${feeTokenDenom} Cannot punish`}</Text>
                  ) : (
                    <Text>{`${memberEscrowInit} ${feeTokenDenom}`}</Text>
                  )}
                </MemberTexts>
              </PunishmentRow>
              <Field
                label={distributionListLabel}
                placeholder="Type or paste addresses here"
                value={distributionListString}
                onInputChange={({ target }) => {
                  setDistributionListString(target.value);
                }}
              />
              <AddressList
                short
                addresses={distributionListArray}
                addressPrefix={config.addressPrefix}
                handleClose={(memberAddress) =>
                  setDistributionListArray(distributionListArray.filter((member) => member !== memberAddress))
                }
              />
              <Field
                label={commentLabel}
                placeholder="Enter comment"
                optional
                value={commentInit}
                onInputChange={({ target }) => {
                  setCommentInit(target.value);
                }}
              />
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button
                  disabled={
                    !isValid ||
                    memberEscrowInit === "0" ||
                    distributionListArray.some(
                      (memberAddress) => !isValidAddress(memberAddress, config.addressPrefix),
                    )
                  }
                  onClick={() => submitForm()}
                >
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
