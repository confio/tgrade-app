import { Radio } from "antd";
import { TxResult } from "App/components/ShowTxResult";
import { useError, useOc, useSdk } from "service";
import { DsoContract } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";

import { ProposalStep, ProposalType } from "../..";
import FormAddParticipants, { FormAddParticipantsValues } from "./FormPunishValidator";
interface ProposalPunishValidtorProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalPunishValidtor({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalPunishValidtorProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();
  const {
    ocState: { ocAddress },
  } = useOc();

  return (
    <>
      {proposalStep.confirmation ? (
        <FormAddParticipants
          validators={[""]}
          comment={""}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={() => console.log("handled submit")}
        />
      ) : (
        <FormAddParticipants
          validators={[""]}
          comment={""}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={() => console.log("handled submit")}
        />
      )}
    </>
  );
}
