import { calculateFee } from "@cosmjs/stargate";
import { Collapse } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import { ReactComponent as StatusExecutedIcon } from "App/assets/icons/status-executed-icon.svg";
import { ReactComponent as StatusOpenIcon } from "App/assets/icons/status-open-icon.svg";
import { ReactComponent as StatusPassedIcon } from "App/assets/icons/status-passed-icon.svg";
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
  VoteInfo,
} from "utils/oversightCommunity";
import { isTcProposalResponse, VoteOption } from "utils/trustedCircle";

import ButtonVote from "../ButtonVote";
import VotesTable from "../VotesTable";
import ProposalAddOCMembers from "./components/ProposalAddOCMembers";
import ProposalGrantEngagementPoints from "./components/ProposalGrantEngagementPoints";
import ProposalPunishOCMember from "./components/ProposalPunishOCMember";
import ProposalPunishValidator from "./components/ProposalPunishValidator";
import ProposalUnjailValidator from "./components/ProposalUnjailValidator";
import {
  ButtonGroup,
  FeeWrapper,
  ModalHeader,
  Paragraph,
  SectionWrapper,
  Separator,
  StyledCollapse,
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

  const proposalUnjailValidator =
    proposal && isOcProposalResponse(proposal) ? proposal.proposal.unjail : undefined;

  const [membership, setMembership] = useState<"participant" | "pending" | "voting">("participant");

  const [isTableLoading, setTableLoading] = useState(false);
  const [votes, setVotes] = useState<readonly VoteInfo[]>([]);
  useEffect(() => {
    (async function queryVotes() {
      if (!client || !mixedProposalId) return;

      try {
        const ocContract = new OcContractQuerier(config, client);
        setTableLoading(true);
        const votes = await ocContract.getAllMixedVotes(mixedProposalId);
        setVotes(votes);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      } finally {
        setTableLoading(false);
      }
    })();
  }, [client, config, handleError, mixedProposalId]);

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
        backgroundColor: "var(--bg-body)",
      }}
      maskStyle={{ background: "rgba(26, 29, 38,0.6)" }}
    >
      {txResult ? (
        <ShowTxResult {...txResult}>
          {txResult.error ? (
            <Button onClick={() => setTxResult(undefined)}>
              <span>Try again</span>
            </Button>
          ) : null}
          <Button onClick={() => resetModal()}>
            <span>Go to Arbiter Pool details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <Stack gap="s1">
          <ModalHeader>
            {proposal ? (
              <div>
                <Title>
                  ID {proposal.mixedId} "{getProposalTitle(proposal.proposal)}"
                </Title>
                {proposal?.status === "passed" ? <StatusPassedIcon /> : null}
                {proposal?.status === "open" ? <StatusOpenIcon /> : null}
                {proposal?.status === "executed" ? <StatusExecutedIcon /> : null}
              </div>
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
                <ProposalUnjailValidator proposalUnjailValidator={proposalUnjailValidator} />
                <TextValue>{proposal.description}</TextValue>
              </Stack>
              <Separator />
              <SectionWrapper>
                <StyledCollapse ghost>
                  <Collapse.Panel
                    key="1"
                    header={
                      <SectionWrapper>
                        <Text>Progress and results</Text>
                        <SectionWrapper>
                          <Paragraph>
                            Total voted:
                            <b>
                              {calculateTotalVotes()} of {proposal.total_points}
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
                    }
                  >
                    <VotesTable isLoading={isTableLoading} votes={votes} />
                  </Collapse.Panel>
                </StyledCollapse>
              </SectionWrapper>
              <Separator />
              <SectionWrapper>
                {address && proposal?.status === "passed" ? (
                  <Button onClick={submitExecuteProposal} loading={submitting === "executing"}>
                    Execute Proposal
                  </Button>
                ) : null}
                <ButtonGroup>
                  <FeeWrapper>
                    <p>Transaction fee</p>
                    <p>{`~${txFee} ${feeTokenDenom}`}</p>
                  </FeeWrapper>
                  <ButtonVote
                    vote="yes"
                    disabled={!canUserVote || !!submitting}
                    loading={submitting === "yes"}
                    onClick={() => submitVoteProposal("yes")}
                  >
                    Yes
                  </ButtonVote>
                  <ButtonVote
                    vote="no"
                    disabled={!canUserVote || !!submitting}
                    loading={submitting === "no"}
                    onClick={() => submitVoteProposal("no")}
                  >
                    No
                  </ButtonVote>
                  <ButtonVote
                    vote="abstain"
                    disabled={!canUserVote || !!submitting}
                    loading={submitting === "abstain"}
                    onClick={() => submitVoteProposal("abstain")}
                  >
                    Abstain
                  </ButtonVote>
                </ButtonGroup>
              </SectionWrapper>
            </>
          ) : null}
        </Stack>
      )}
    </StyledModal>
  );
}
