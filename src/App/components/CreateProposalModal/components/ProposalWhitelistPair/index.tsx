import { TxResult } from "App/components/ShowTxResult";
import { DsoHomeParams } from "App/pages/DsoHome";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getDsoName, useDso, useError, useSdk } from "service";
import { DsoContract } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";
import { ProposalStep, ProposalType } from "../..";
import ConfirmationWhitelistPair from "./components/ConfirmationWhitelistPair";
import FormWhitelistPair, { FormWhiteilstPairValues } from "./components/FormWhitelistPair";

interface ProposalWhitelistPairProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalWhitelistPair({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalWhitelistPairProps): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();
  const {
    dsoState: { dsos },
  } = useDso();

  const [pairAddress, setPairAddress] = useState("");
  const [comment, setComment] = useState("");

  async function submitAddParticipants({ pairAddress, comment }: FormWhiteilstPairValues) {
    setPairAddress(pairAddress);
    setComment(comment);
    setProposalStep({ type: ProposalType.WhitelistPair, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const dsoContract = new DsoContract(dsoAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.propose(address, comment, {
        add_remove_non_voting_members: {
          remove: [],
          add: [pairAddress],
        },
      });

      const dsoName = getDsoName(dsos, dsoAddress);
      setTxResult({
        msg: `Created proposal for whitelisting pair to ${dsoName} (${dsoAddress}). Transaction ID: ${transactionHash}`,
      });
    } catch (error) {
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {proposalStep.confirmation ? (
        <ConfirmationWhitelistPair
          pairAddress={pairAddress}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.WhitelistPair })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormWhitelistPair
          pairAddress={pairAddress}
          setPairAddress={setPairAddress}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitAddParticipants}
        />
      )}
    </>
  );
}
