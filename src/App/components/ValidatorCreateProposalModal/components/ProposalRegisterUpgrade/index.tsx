import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { ValidatorVotingContract } from "utils/validatorVoting";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationRegisterUpgrade from "./components/ConfirmationRegisterUpgrade";
import FormRegisterUpgrade, { FormRegisterUpgradeValues } from "./components/FormRegisterUpgrade";

interface ProposalRegisterUpgradeProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalRegisterUpgrade({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalRegisterUpgradeProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [info, setInfo] = useState("");
  const [comment, setComment] = useState("");

  async function submitRegisterUpgrade({ name, height, info, comment }: FormRegisterUpgradeValues) {
    setName(name);
    setHeight(height);
    setInfo(info);
    setComment(comment);
    setProposalStep({ type: ProposalType.RegisterUpgrade, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const validatorVotingContract = new ValidatorVotingContract(config, signingClient);
      const transactionHash = await validatorVotingContract.propose(address, comment, {
        register_upgrade: { name, height: parseInt(height, 10), info },
      });

      setTxResult({
        msg: `Created proposal for registering upgrade. Transaction ID: ${transactionHash}`,
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
        <ConfirmationRegisterUpgrade
          name={name}
          height={height}
          info={info}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.RegisterUpgrade })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormRegisterUpgrade
          name={name}
          height={height}
          info={info}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitRegisterUpgrade}
        />
      )}
    </>
  );
}
