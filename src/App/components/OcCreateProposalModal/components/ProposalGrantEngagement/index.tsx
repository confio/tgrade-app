import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useOc, useSdk } from "service";
import { DsoContract } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationGrantEngagement from "./components/ConfirmationGrantEngagement";
import FormGrantEngagement, { FormGrantEngagementValues } from "./components/FormGrantEngagement";

interface ProposalGrantEngagementProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalGrantEngagement({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalGrantEngagementProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();
  const {
    ocState: { ocProposalsAddress },
  } = useOc();

  const [member, setMember] = useState("");
  const [points, setPoints] = useState("");
  const [comment, setComment] = useState("");

  async function submitGrantEngagement({ member, points, comment }: FormGrantEngagementValues) {
    setMember(member);
    setPoints(points);
    setComment(comment);
    setProposalStep({ type: ProposalType.GrantEngagement, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!ocProposalsAddress || !signingClient || !address) return;
    setSubmitting(true);

    try {
      const dsoContract = new DsoContract(ocProposalsAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.propose(
        signingClient,
        config.factoryAddress,
        address,
        comment,
        {
          grant_engagement: {
            member,
            points: parseInt(points, 10),
          },
        },
      );

      setTxResult({
        msg: `Created proposal for granting Engagement Points from Oversight Community Proposals (${ocProposalsAddress}). Transaction ID: ${transactionHash}`,
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
        <ConfirmationGrantEngagement
          member={member}
          points={points}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.GrantEngagement })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormGrantEngagement
          member={member}
          points={points}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitGrantEngagement}
        />
      )}
    </>
  );
}
