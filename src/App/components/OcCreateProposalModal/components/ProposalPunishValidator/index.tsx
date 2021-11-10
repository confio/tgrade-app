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

  async function submitCreateProposal() {
    if (!ocAddress || !signingClient || !address) return;
    setSubmitting(true);

    try {
      const dsoContract = new DsoContract(ocAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.propose(signingClient, config.factoryAddress, address, "", {
        add_remove_non_voting_members: {
          remove: [],
          add: [""],
        },
      });

      setTxResult({
        msg: `Created proposal to punish validator in Oversight Committee (${ocAddress}). Transaction ID: ${transactionHash}`,
      });
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

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
