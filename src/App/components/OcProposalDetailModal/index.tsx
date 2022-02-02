import { calculateFee } from "@cosmjs/stargate";
import { ReactComponent as AbstainIcon } from "App/assets/icons/abstain-icon.svg";
import closeIcon from "App/assets/icons/cross.svg";
import { ReactComponent as RejectIcon } from "App/assets/icons/no-icon.svg";
import { ReactComponent as StatusExecutedIcon } from "App/assets/icons/status-executed-icon.svg";
import { ReactComponent as StatusOpenIcon } from "App/assets/icons/status-open-icon.svg";
import { ReactComponent as StatusPassedIcon } from "App/assets/icons/status-passed-icon.svg";
import { ReactComponent as AcceptIcon } from "App/assets/icons/yes-icon.svg";
import Button from "App/components/Button";
import ShowTxResult, { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { getDisplayAmountFromFee } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import {
  getProposalTitle,
  isOcProposalResponse,
  MixedProposalResponse,
  MixedProposalResponseId,
  OcContract,
  OcContractQuerier,
} from "utils/oversightCommunity";
import { isTcProposalResponse, VoteOption } from "utils/trustedCircle";

import ProposalAddOCMembers from "./components/ProposalAddOCMembers";
import ProposalGrantEngagementPoints from "./components/ProposalGrantEngagementPoints";
import ProposalPunishOCMember from "./components/ProposalPunishOCMember";
import ProposalPunishValidator from "./components/ProposalPunishValidator";
import {
  AbstainedButton,
  AcceptButton,
  ButtonGroup,
  ExecuteButton,
  FeeWrapper,
  ModalHeader,
  Paragraph,
  RejectButton,
  SectionWrapper,
  Separator,
  StyledModal,
  Text,
  TextValue,
  Title,
} from "./style";

interface OcProposalDetailModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly mixedProposalId?: MixedProposalResponseId;
  readonly refreshProposals: () => void;
}

export default function OcProposalDetailModal({
  isModalOpen,
  closeModal,
  mixedProposalId,
  refreshProposals,
}: OcProposalDetailModalProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client, address, signingClient },
  } = useSdk();

  const [submitting, setSubmitting] = useState<VoteOption | "executing">();
  const [txResult, setTxResult] = useState<TxResult>();
  const [hasVoted, setHasVoted] = useState(false);

  const [txFee, setTxFee] = useState("0");
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";

  const [proposal, setProposal] = useState<MixedProposalResponse>();
  const expiryTime = proposal
    ? Number(typeof proposal.expires === "string" ? proposal.expires : proposal.expires.at_time) / 1000000
    : 0;
  const isProposalNotExpired = expiryTime > Date.now();

  // DSO proposals
  const proposalAddOCMembers =
    proposal && isTcProposalResponse(proposal) ? proposal.proposal.add_voting_members?.voters : undefined;
  const proposalPunishOCMember =
    proposal && isTcProposalResponse(proposal) ? proposal.proposal.punish_members?.[0] : undefined;
  // OC proposals
  const proposalGrantEngagementPoints =
    proposal && isOcProposalResponse(proposal) ? proposal.proposal.grant_engagement : undefined;
  const proposalPunishValidator =
    proposal && isOcProposalResponse(proposal) ? proposal.proposal.punish : undefined;

  const [membership, setMembership] = useState<"participant" | "pending" | "voting">("participant");

  useEffect(() => {
    if (!signingClient) return;

    try {
      const fee = calculateFee(OcContract.GAS_VOTE, config.gasPrice);
      const txFee = getDisplayAmountFromFee(fee, config);
      setTxFee(txFee);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }, [config, handleError, signingClient]);

  useEffect(() => {
    (async function queryProposal() {
      if (!client || !mixedProposalId) return;

      try {
        const ocContract = new OcContractQuerier(config, client);
        const proposal = await ocContract.getMixedProposal(mixedProposalId);
        setProposal(proposal);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, config, handleError, mixedProposalId]);

  useEffect(() => {
    (async function queryVoter() {
      if (!client || !mixedProposalId || !address) return;

      try {
        const ocContract = new OcContractQuerier(config, client);
        const voteResponse = await ocContract.getMixedVote(mixedProposalId, address);
        setHasVoted(voteResponse.vote?.voter === address);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, client, config, handleError, mixedProposalId]);

  useEffect(() => {
    (async function queryMembership() {
      if (!client || !address) return;

      try {
        const ocContract = new OcContractQuerier(config, client);
        const escrowResponse = await ocContract.getEscrow(address);

        if (escrowResponse) {
          const membership = escrowResponse.status.voting ? "voting" : "pending";
          setMembership(membership);
        } else {
          setMembership("participant");
        }
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, client, config, handleError]);

  function resetModal() {
    closeModal();
    setTxResult(undefined);
    refreshProposals();
  }

  async function submitVoteProposal(chosenVote: VoteOption) {
    if (!signingClient || !address || !mixedProposalId) return;
    setSubmitting(chosenVote);

    try {
      const ocContract = new OcContract(config, signingClient);
      const transactionHash = await ocContract.voteProposal(address, mixedProposalId, chosenVote);

      setTxResult({
        msg: `Voted proposal with ID ${mixedProposalId}. Transaction ID: ${transactionHash}`,
      });
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(undefined);
    }
  }

  function calculateTotalVotes(): number {
    return (proposal?.votes.yes ?? 0) + (proposal?.votes.no ?? 0) + (proposal?.votes.abstain ?? 0);
  }

  async function submitExecuteProposal() {
    if (!signingClient || !address || !mixedProposalId) return;
    setSubmitting("executing");

    try {
      const ocContract = new OcContract(config, signingClient);
      const transactionHash = await ocContract.executeProposal(address, mixedProposalId);

      setTxResult({
        msg: `Executed proposal with ID ${mixedProposalId}. Transaction ID: ${transactionHash}`,
      });
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(undefined);
    }
  }

  const canUserVote =
    address &&
    !hasVoted &&
    isProposalNotExpired &&
    membership === "voting" &&
    (proposal?.status === "open" || proposal?.status === "passed");

  return (
    <StyledModal
      centered
      footer={null}
      closable={false}
      visible={isModalOpen}
      width="100%"
      bgTransparent={!!txResult}
      style={{
        right: "-40px",
        maxWidth: "63.25rem",
        paddingRight: "60px",
      }}
      bodyStyle={{
        position: "relative",
        padding: "var(--s1)",
        borderRadius: "16px",
        backgroundColor: txResult ? "transparent" : "var(--bg-body)",
      }}
      maskStyle={{ background: txResult ? "rgba(4,119,120,0.9)" : "rgba(4,119,120,0.6)" }}
    >
      {txResult ? (
        <ShowTxResult {...txResult}>
          {txResult.error ? (
            <Button onClick={() => setTxResult(undefined)}>
              <span>Try again</span>
            </Button>
          ) : null}
          <Button onClick={() => resetModal()}>
            <span>Go to Oversight Community details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <Stack gap="s1">
          <ModalHeader>
            {proposal ? (
              <Stack gap="s1">
                <Title>
                  ID {proposal.mixedId} "{getProposalTitle(proposal.proposal)}"
                </Title>
              </Stack>
            ) : null}
            {!submitting ? <img alt="Close button" src={closeIcon} onClick={() => resetModal()} /> : null}
          </ModalHeader>
          <Separator />
          {proposal ? (
            <>
              <Stack gap="s1">
                <ProposalAddOCMembers proposalAddVotingMembers={proposalAddOCMembers} />
                <ProposalPunishOCMember proposalPunishVotingMember={proposalPunishOCMember} />
                <ProposalGrantEngagementPoints proposalGrantEngagement={proposalGrantEngagementPoints} />
                <ProposalPunishValidator proposalPunishValidator={proposalPunishValidator} />
                <TextValue>{proposal.description}</TextValue>
              </Stack>
              <Separator />
              <SectionWrapper>
                <Text>Progress And results</Text>
                <SectionWrapper>
                  <Paragraph>
                    Total voted:
                    <b>
                      {calculateTotalVotes()} of {proposal.total_weight}
                    </b>
                  </Paragraph>
                  <Paragraph>
                    Yes: <b>{proposal.votes.yes ?? 0}</b>
                  </Paragraph>
                  <Paragraph>
                    No: <b>{proposal.votes.no ?? 0}</b>
                  </Paragraph>
                  <Paragraph>
                    Abstain: <b>{proposal.votes.abstain ?? 0}</b>
                  </Paragraph>
                </SectionWrapper>
              </SectionWrapper>
              <Separator />
              <SectionWrapper>
                <SectionWrapper>
                  {proposal?.status === "passed" ? <StatusPassedIcon /> : null}
                  {proposal?.status === "open" ? <StatusOpenIcon /> : null}
                  {proposal?.status === "executed" ? <StatusExecutedIcon /> : null}

                  {address && proposal?.status === "passed" ? (
                    <ExecuteButton onClick={submitExecuteProposal}>Execute Proposal</ExecuteButton>
                  ) : null}
                </SectionWrapper>
                <ButtonGroup>
                  <FeeWrapper>
                    <p>Transaction fee</p>
                    <p>{`~${txFee} ${feeTokenDenom}`}</p>
                  </FeeWrapper>
                  <AbstainedButton
                    disabled={!canUserVote || (submitting && submitting !== "abstain")}
                    icon={<AbstainIcon />}
                    loading={submitting === "abstain"}
                    onClick={() => submitVoteProposal("abstain")}
                  >
                    Abstain
                  </AbstainedButton>
                  <RejectButton
                    icon={<RejectIcon />}
                    loading={submitting === "no"}
                    disabled={!canUserVote || (submitting && submitting !== "no")}
                    onClick={() => submitVoteProposal("no")}
                  >
                    No
                  </RejectButton>
                  <AcceptButton
                    loading={submitting === "yes"}
                    disabled={!canUserVote || (submitting && submitting !== "yes")}
                    onClick={() => submitVoteProposal("yes")}
                  >
                    {<AcceptIcon />}
                    Yes
                  </AcceptButton>
                </ButtonGroup>
              </SectionWrapper>
            </>
          ) : null}
        </Stack>
      )}
    </StyledModal>
  );
}
