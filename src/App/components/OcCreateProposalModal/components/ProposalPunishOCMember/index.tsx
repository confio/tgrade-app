import { TxResult } from "App/components/ShowTxResult";
import { useState } from "react";
import { useError, useOc, useSdk } from "service";
import { DsoContract, Punishment } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";

import { ProposalStep, ProposalType } from "../..";
import ConfirmationPunishOCMember from "./components/ConfirmationPunishOCMember";
import FormPunishOCMember, { FormPunishOCMemberValues } from "./components/FormPunishOCMember";

interface ProposalPunishOCMemberProps {
  readonly proposalStep: ProposalStep;
  readonly setProposalStep: React.Dispatch<React.SetStateAction<ProposalStep | undefined>>;
  readonly isSubmitting: boolean;
  readonly setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function ProposalPunishOCMember({
  proposalStep,
  setProposalStep,
  isSubmitting,
  setSubmitting,
  setTxResult,
}: ProposalPunishOCMemberProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { address, signingClient, config },
  } = useSdk();
  const {
    ocState: { ocAddress },
  } = useOc();

  const [memberToPunish, setMemberToPunish] = useState("");
  const [memberEscrow, setMemberEscrow] = useState("0");
  const [slashingPercentage, setSlashingPercentage] = useState("");
  const [kickOut, setKickOut] = useState(false);
  const [distributionList, setDistributionList] = useState<readonly string[]>([]);
  const [comment, setComment] = useState("");

  async function submitPunishOCMember({
    memberToPunish,
    memberEscrow,
    slashingPercentage,
    kickOut,
    distributionList,
    comment,
  }: FormPunishOCMemberValues) {
    setMemberToPunish(memberToPunish);
    setMemberEscrow(memberEscrow);
    setSlashingPercentage(slashingPercentage);
    setKickOut(kickOut);
    setDistributionList(distributionList);
    setComment(comment);
    setProposalStep({ type: ProposalType.PunishOCMember, confirmation: true });
  }

  async function submitCreateProposal() {
    if (!ocAddress || !signingClient || !address) return;
    setSubmitting(true);

    try {
      const dsoContract = new DsoContract(ocAddress, signingClient, config.gasPrice);
      const nativeSlashing = slashingPercentage ? (parseFloat(slashingPercentage) / 100).toString() : "0";

      const punishment: Punishment = distributionList.length
        ? {
            DistributeEscrow: {
              distribution_list: distributionList,
              member: memberToPunish,
              slashing_percentage: nativeSlashing,
              kick_out: kickOut,
            },
          }
        : {
            BurnEscrow: {
              member: memberToPunish,
              slashing_percentage: nativeSlashing,
              kick_out: kickOut,
            },
          };

      const transactionHash = await dsoContract.propose(address, comment, { punish_members: [punishment] });

      setTxResult({
        msg: `Created proposal for punishing member to Oversight Community (${ocAddress}). Transaction ID: ${transactionHash}`,
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
        <ConfirmationPunishOCMember
          memberToPunish={memberToPunish}
          memberEscrow={memberEscrow}
          slashingPercentage={slashingPercentage}
          kickOut={kickOut}
          distributionList={distributionList}
          comment={comment}
          isSubmitting={isSubmitting}
          goBack={() => setProposalStep({ type: ProposalType.PunishOCMember })}
          submitForm={submitCreateProposal}
        />
      ) : (
        <FormPunishOCMember
          memberToPunish={memberToPunish}
          slashingPercentage={slashingPercentage}
          kickOut={kickOut}
          distributionList={distributionList}
          comment={comment}
          goBack={() => setProposalStep(undefined)}
          handleSubmit={submitPunishOCMember}
        />
      )}
    </>
  );
}
