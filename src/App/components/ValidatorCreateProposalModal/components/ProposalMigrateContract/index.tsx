import { toBase64, toUtf8 } from "@cosmjs/encoding";
import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { ValidatorVotingContract } from "utils/validatorVoting";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationMigrateContract from "./components/ConfirmationMigrateContract";
import FormMigrateContract, { FormMigrateContractValues } from "./components/FormMigrateContract";

interface ProposalMigrateContractProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalMigrateContract({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalMigrateContractProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [contract, setContract] = useState("");
  const [codeId, setCodeId] = useState("");
  const [migrateMsg, setMigrateMsg] = useState("");
  const [comment, setComment] = useState("");

  async function submitMigrateContract({ contract, codeId, migrateMsg, comment }: FormMigrateContractValues) {
    setContract(contract);
    setCodeId(codeId);
    setMigrateMsg(migrateMsg);
    setComment(comment);
    setProposalStep({ type: ProposalType.MigrateContract, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const validatorVotingContract = new ValidatorVotingContract(config, signingClient);
      const { txHash } = await validatorVotingContract.propose(address, comment, {
        migrate_contract: {
          contract,
          code_id: parseInt(codeId, 10),
          migrate_msg: toBase64(toUtf8(migrateMsg || "{}")),
        },
      });

      setTxResult({
        msg: `Created proposal for migrating contract. Transaction ID: ${txHash}`,
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
        <ConfirmationMigrateContract
          contract={contract}
          codeId={codeId}
          migrateMsg={migrateMsg}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.MigrateContract })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormMigrateContract
          contract={contract}
          codeId={codeId}
          migrateMsg={migrateMsg}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitMigrateContract}
        />
      )}
    </>
  );
}
