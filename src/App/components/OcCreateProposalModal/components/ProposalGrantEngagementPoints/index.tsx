import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { OcContract } from "utils/oversightCommunity";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationGrantEngagementPoints from "./components/ConfirmationGrantEngagementPoints";
import FormGrantEngagementPoints, {
  FormGrantEngagementPointsValues,
} from "./components/FormGrantEngagementPoints";

interface ProposalGrantEngagementPointsProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalGrantEngagementPoints({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalGrantEngagementPointsProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();

  const [member, setMember] = useState("");
  const [points, setPoints] = useState("");
  const [comment, setComment] = useState("");

  async function submitGrantEngagementPoints({ member, points, comment }: FormGrantEngagementPointsValues) {
    setMember(member);
    setPoints(points);
    setComment(comment);
    setProposalStep({ type: ProposalType.GrantEngagementPoints, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const ocContract = new OcContract(config, signingClient);
      const transactionHash = await ocContract.propose(address, comment, {
        grant_engagement: {
          member,
          points: parseInt(points, 10),
        },
      });

      setTxResult({
        msg: `Created proposal for granting Engagement Points from Oversight Community Proposals. Transaction ID: ${transactionHash}`,
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
        <ConfirmationGrantEngagementPoints
          member={member}
          points={points}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.GrantEngagementPoints })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormGrantEngagementPoints
          member={member}
          points={points}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitGrantEngagementPoints}
        />
      )}
    </>
  );
}
