import { TxResult } from "App/components/ShowTxResult";
import { DsoHomeParams } from "App/pages/DsoHome";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getDsoName, useDso, useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { Punishment, TcContract } from "utils/trustedCircle";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationPunishVotingParticipant from "./components/ConfirmationPunishVotingParticipant";
import FormPunishVotingParticipant, {
  FormPunishVotingParticipantValues,
} from "./components/FormPunishVotingParticipant";

interface ProposalPunishVotingParticipantProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalPunishVotingParticipant({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalPunishVotingParticipantProps): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();
  const {
    dsoState: { dsos },
  } = useDso();

  const [memberToPunish, setMemberToPunish] = useState("");
  const [memberEscrow, setMemberEscrow] = useState("0");
  const [slashingPercentage, setSlashingPercentage] = useState("");
  const [kickOut, setKickOut] = useState(false);
  const [distributionList, setDistributionList] = useState<readonly string[]>([]);
  const [comment, setComment] = useState("");

  async function submitPunishVotingParticipant({
    memberToPunish,
    memberEscrow,
    slashingPercentage,
    kickOut,
    distributionList,
    comment,
  }: FormPunishVotingParticipantValues) {
    setMemberToPunish(memberToPunish);
    setMemberEscrow(memberEscrow);
    setSlashingPercentage(slashingPercentage);
    setKickOut(kickOut);
    setDistributionList(distributionList);
    setComment(comment);
    setProposalStep({ type: ProposalType.PunishVotingParticipant, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!signingClient || !address) return;
    setSubmitting(true);

    try {
      const dsoContract = new TcContract(dsoAddress, signingClient, config.gasPrice);
      const nativeSlashing = slashingPercentage ? (parseFloat(slashingPercentage) / 100).toString() : "0";

      const punishment: Punishment = distributionList.length
        ? {
            distribute_escrow: {
              distribution_list: distributionList,
              member: memberToPunish,
              slashing_percentage: nativeSlashing,
              kick_out: kickOut,
            },
          }
        : {
            burn_escrow: {
              member: memberToPunish,
              slashing_percentage: nativeSlashing,
              kick_out: kickOut,
            },
          };

      const { txHash } = await dsoContract.propose(address, comment, { punish_members: [punishment] });

      const dsoName = getDsoName(dsos, dsoAddress);
      setTxResult({
        msg: `Created proposal for punishing voting member to ${dsoName} (${dsoAddress}). Transaction ID: ${txHash}`,
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
        <ConfirmationPunishVotingParticipant
          memberToPunish={memberToPunish}
          memberEscrow={memberEscrow}
          slashingPercentage={slashingPercentage}
          kickOut={kickOut}
          distributionList={distributionList}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.PunishVotingParticipant })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormPunishVotingParticipant
          memberToPunish={memberToPunish}
          slashingPercentage={slashingPercentage}
          kickOut={kickOut}
          distributionList={distributionList}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitPunishVotingParticipant}
        />
      )}
    </>
  );
}
