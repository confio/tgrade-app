import Button from "App/components/form/Button";
import Checkbox from "App/components/form/Checkbox";
import { Field } from "App/components/form/Field";
import { BackButtonOrLink } from "App/components/logic";
import { DsoHomeParams } from "App/routes/Dso/routes/DsoHome";
import { Formik } from "formik";
import { Form } from "formik-antd";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { getFormItemName } from "utils/forms";
import * as Yup from "yup";
import { ButtonGroup, FieldGroup, FormStack, Separator } from "./style";

const dsoNameLabel = "Add new name for the DSO";
const quorumLabel = "Quorum";
const thresholdLabel = "Threshold";
const votingDurationLabel = "Voting duration";
const escrowAmountLabel = "Escrow amount";
const earlyPassLabel = "Allow end early?";
const commentLabel = "Comment";

const validationSchema = Yup.object().shape({
  [getFormItemName(dsoNameLabel)]: Yup.string().typeError("DSO name must be alphanumeric"),
  [getFormItemName(quorumLabel)]: Yup.number()
    .typeError("Quorum must be a number")
    .positive("Quorum must be positive")
    .max(100, "Quorum must be 100 maximum"),
  [getFormItemName(thresholdLabel)]: Yup.number()
    .typeError("Threshold must be a number")
    .positive("Threshold must be positive")
    .max(100, "Threshold must be 100 maximum"),
  [getFormItemName(votingDurationLabel)]: Yup.number()
    .typeError("Voting duration must be a number")
    .positive("Voting duration must be positive"),
  [getFormItemName(escrowAmountLabel)]: Yup.number()
    .typeError("Voting duration must be a number")
    .positive("Voting duration must be positive"),
  [getFormItemName(commentLabel)]: Yup.string().typeError("Comment must be alphanumeric"),
});

export interface FormEditDsoValues {
  readonly dsoName: string;
  readonly quorum: string;
  readonly threshold: string;
  readonly votingDuration: string;
  readonly escrowAmount: string;
  readonly earlyPass: boolean;
  readonly comment: string;
}

interface FormEditDsoProps extends FormEditDsoValues {
  readonly goBack: () => void;
  readonly handleSubmit: (values: FormEditDsoValues) => void;
}

export default function FormEditDso({
  goBack,
  handleSubmit,
  dsoName,
  quorum,
  threshold,
  votingDuration,
  escrowAmount,
  earlyPass,
  comment,
}: FormEditDsoProps): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { signingClient, config },
  } = useSdk();

  const [dsoNamePlaceholder, setDsoNamePlaceholder] = useState("");
  const [quorumPlaceholder, setQuorumPlaceholder] = useState("");
  const [thresholdPlaceholder, setThresholdPlaceholder] = useState("");
  const [votingDurationPlaceholder, setVotingDurationPlaceholder] = useState("");
  const [escrowAmountPlaceholder, setEscrowAmountPlaceholder] = useState("");

  useEffect(() => {
    (async function queryDso() {
      try {
        const dsoQuery = await signingClient.queryContractSmart(dsoAddress, { dso: {} });
        const escrowCoin = nativeCoinToDisplay(
          { denom: config.feeToken, amount: dsoQuery.escrow_amount },
          config.coinMap,
        );

        setDsoNamePlaceholder(dsoQuery.name);
        setQuorumPlaceholder((parseFloat(dsoQuery.rules.quorum) * 100).toString());
        setThresholdPlaceholder((parseFloat(dsoQuery.rules.threshold) * 100).toString());
        setVotingDurationPlaceholder(dsoQuery.rules.voting_period);
        setEscrowAmountPlaceholder(escrowCoin.amount);
      } catch (error) {
        handleError(error);
      }
    })();
  }, [config.coinMap, config.feeToken, dsoAddress, handleError, signingClient]);

  return (
    <Formik
      initialValues={{
        [getFormItemName(dsoNameLabel)]: dsoName,
        [getFormItemName(quorumLabel)]: quorum,
        [getFormItemName(thresholdLabel)]: threshold,
        [getFormItemName(votingDurationLabel)]: votingDuration,
        [getFormItemName(escrowAmountLabel)]: escrowAmount,
        [getFormItemName(earlyPassLabel)]: earlyPass,
        [getFormItemName(commentLabel)]: comment,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) =>
        handleSubmit({
          dsoName: values[getFormItemName(dsoNameLabel)].toString(),
          quorum: values[getFormItemName(quorumLabel)].toString(),
          threshold: values[getFormItemName(thresholdLabel)].toString(),
          votingDuration: values[getFormItemName(votingDurationLabel)].toString(),
          escrowAmount: values[getFormItemName(escrowAmountLabel)].toString(),
          earlyPass: !!values[getFormItemName(earlyPassLabel)],
          comment: values[getFormItemName(commentLabel)].toString(),
        })
      }
    >
      {({ dirty, isValid, submitForm }) => (
        <>
          <Form>
            <FormStack gap="s1">
              <Field label={dsoNameLabel} placeholder={`${dsoNamePlaceholder || "Enter DSO name"}`} />
              <FieldGroup>
                <Field label={quorumLabel} placeholder={`${quorumPlaceholder || "Enter quorum"}`} units="%" />
                <Field
                  label={thresholdLabel}
                  placeholder={`${thresholdPlaceholder || "Enter threshold"}`}
                  units="%"
                />
              </FieldGroup>
              <FieldGroup>
                <Field
                  label={votingDurationLabel}
                  placeholder={`${votingDurationPlaceholder || "Enter duration"}`}
                  units="Days"
                />
                <Field
                  label={escrowAmountLabel}
                  placeholder={`${escrowAmountPlaceholder || "Enter amount"}`}
                  units="TGD"
                />
              </FieldGroup>
              <Checkbox name={getFormItemName(earlyPassLabel)}>{earlyPassLabel}</Checkbox>
              <Field label={commentLabel} placeholder="Enter comment" />
              <Separator />
              <ButtonGroup>
                <BackButtonOrLink onClick={() => goBack()} text="Back" />
                <Button disabled={!isValid} onClick={() => submitForm()}>
                  <div>Next</div>
                </Button>
              </ButtonGroup>
            </FormStack>
          </Form>
        </>
      )}
    </Formik>
  );
}
