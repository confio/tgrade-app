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
import { useError, useOc, useSdk } from "service";
import { getDisplayAmountFromFee } from "utils/currency";
import { DsoContract, DsoContractQuerier, ProposalResponse, VoteOption } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";

import ProposalAddMembers from "./components/ProposalAddMembers";
import ProposalAddVotingMembers from "./components/ProposalAddVotingMembers";
import ProposalGrantEngagement from "./components/ProposalGrantEngagement";
import ProposalPunishVotingMember from "./components/ProposalPunishVotingMember";
import ProposalRemoveMembers from "./components/ProposalRemoveMembers";
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
  readonly proposalId: string | undefined;
  readonly refreshProposals: () => void;
}

export default function OcProposalDetailModal({
  isModalOpen,
  closeModal,
  proposalId,
  refreshProposals,
}: OcProposalDetailModalProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client, address, signingClient },
  } = useSdk();
  const {
    ocState: { ocAddress, ocProposalsAddress },
  } = useOc();

  const [submitting, setSubmitting] = useState<VoteOption | "executing">();
  const [txResult, setTxResult] = useState<TxResult>();
  const [hasVoted, setHasVoted] = useState(false);

  const [txFee, setTxFee] = useState("0");
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";

  const [proposal, setProposal] = useState<ProposalResponse>();
  const isProposalNotExpired = proposal
    ? new Date(parseInt(proposal.expires.at_time, 10) / 1000000) > new Date()
    : false;
  const proposalAddMembers = proposal?.proposal.add_remove_non_voting_members?.add;
  const proposalRemoveMembers = proposal?.proposal.add_remove_non_voting_members?.remove;
  const proposalAddVotingMembers = proposal?.proposal.add_voting_members?.voters;
  const proposalPunishVotingMember = proposal?.proposal.punish_members?.[0] ?? undefined;
  const proposalGrantEngagement = proposal?.proposal.grant_engagement;

  const [membership, setMembership] = useState<"participant" | "pending" | "voting">("participant");

  useEffect(() => {
    if (!signingClient) return;

    try {
      const fee = calculateFee(DsoContract.GAS_VOTE, config.gasPrice);
      const txFee = getDisplayAmountFromFee(fee, config);
      setTxFee(txFee);
    } catch (error) {
      if (!(error instanceof Error)) return;
      handleError(error);
    }
  }, [config, handleError, signingClient]);

  useEffect(() => {
    (async function queryProposal() {
      if (!ocAddress || !ocProposalsAddress || !client || !proposalId) return;

      try {
        const dsoContract = new DsoContractQuerier(ocAddress, client);
        const ocProposalContract = new DsoContractQuerier(ocProposalsAddress, client);

        const proposalIdType = proposalId.slice(0, 2);
        const proposalIdNumber = parseInt(proposalId.slice(2), 10);
        const getProposal =
          proposalIdType === "tc"
            ? () => dsoContract.getProposal(proposalIdNumber)
            : () => ocProposalContract.getProposal(proposalIdNumber);

        const proposal = await getProposal();
        setProposal(proposal);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, handleError, ocAddress, ocProposalsAddress, proposalId]);

  useEffect(() => {
    (async function queryVoter() {
      if (!ocAddress || !ocProposalsAddress || !address || !client || !proposalId) return;

      try {
        const dsoContract = new DsoContractQuerier(ocAddress, client);
        const ocProposalContract = new DsoContractQuerier(ocProposalsAddress, client);

        const proposalIdType = proposalId.slice(0, 2);
        const proposalIdNumber = parseInt(proposalId.slice(2), 10);
        const getVote =
          proposalIdType === "tc"
            ? () => dsoContract.getVote(proposalIdNumber, address)
            : () => ocProposalContract.getVote(proposalIdNumber, address);

        const voter = await getVote();
        setHasVoted(voter.vote?.voter === address);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, client, handleError, ocAddress, ocProposalsAddress, proposalId]);

  useEffect(() => {
    (async function queryMembership() {
      if (!ocAddress || !client || !address) return;

      try {
        const dsoContract = new DsoContractQuerier(ocAddress, client);
        const escrowResponse = await dsoContract.getEscrow(address);

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
  }, [address, client, handleError, ocAddress]);

  function resetModal() {
    closeModal();
    setTxResult(undefined);
    refreshProposals();
  }

  async function submitVoteProposal(chosenVote: VoteOption) {
    if (!ocAddress || !ocProposalsAddress || !signingClient || !address || !proposalId) return;
    setSubmitting(chosenVote);

    try {
      const dsoContract = new DsoContract(ocAddress, signingClient, config.gasPrice);
      const ocProposalContract = new DsoContract(ocProposalsAddress, signingClient, config.gasPrice);

      const proposalIdType = proposalId.slice(0, 2);
      const proposalIdNumber = parseInt(proposalId.slice(2), 10);
      const voteProposal =
        proposalIdType === "tc"
          ? () => dsoContract.voteProposal(address, proposalIdNumber, chosenVote)
          : () => ocProposalContract.voteProposal(address, proposalIdNumber, chosenVote);

      const transactionHash = await voteProposal();

      setTxResult({
        msg: `Voted proposal with ID ${proposalId}. Transaction ID: ${transactionHash}`,
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
    if (!ocAddress || !ocProposalsAddress || !signingClient || !address || !proposalId) return;
    setSubmitting("executing");

    try {
      const dsoContract = new DsoContract(ocAddress, signingClient, config.gasPrice);
      const ocProposalContract = new DsoContract(ocProposalsAddress, signingClient, config.gasPrice);

      const proposalIdType = proposalId.slice(0, 2);
      const proposalIdNumber = parseInt(proposalId.slice(2), 10);
      const executeProposal =
        proposalIdType === "tc"
          ? () => dsoContract.executeProposal(address, proposalIdNumber)
          : () => ocProposalContract.executeProposal(address, proposalIdNumber);

      const transactionHash = await executeProposal();

      setTxResult({
        msg: `Executed proposal with ID ${proposalId}. Transaction ID: ${transactionHash}`,
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
                  Nº {proposal.id} "{proposal.title}"
                </Title>
              </Stack>
            ) : null}
            {!submitting ? <img alt="Close button" src={closeIcon} onClick={() => resetModal()} /> : null}
          </ModalHeader>
          <Separator />
          {proposal ? (
            <>
              <Stack gap="s1">
                <ProposalAddMembers proposalAddMembers={proposalAddMembers} />
                <ProposalRemoveMembers proposalRemoveMembers={proposalRemoveMembers} />
                <ProposalAddVotingMembers proposalAddVotingMembers={proposalAddVotingMembers} />
                <ProposalPunishVotingMember proposalPunishVotingMember={proposalPunishVotingMember} />
                <ProposalGrantEngagement proposalGrantEngagement={proposalGrantEngagement} />
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
