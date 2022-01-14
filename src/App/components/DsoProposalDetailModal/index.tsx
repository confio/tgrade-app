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
import { DsoHomeParams } from "App/pages/DsoHome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { getDisplayAmountFromFee } from "utils/currency";
import {
  DsoContract,
  DsoContractQuerier,
  DsoProposalResponse,
  getProposalTitle,
  VoteOption,
} from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";

import ProposalAddMembers from "./components/ProposalAddMembers";
import ProposalAddVotingMembers from "./components/ProposalAddVotingMembers";
import ProposalEditDso from "./components/ProposalEditDso";
import ProposalPunishVotingMember from "./components/ProposalPunishVotingMember";
import ProposalRemoveMembers from "./components/ProposalRemoveMembers";
import ProposalWhitelistPair from "./components/ProposalWhitelistPair";
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

interface DsoProposalDetailModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly proposalId: number | undefined;
  readonly refreshProposals: () => void;
}

export default function DsoProposalDetailModal({
  isModalOpen,
  closeModal,
  proposalId,
  refreshProposals,
}: DsoProposalDetailModalProps): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { config, client, address, signingClient },
  } = useSdk();

  const [submitting, setSubmitting] = useState<VoteOption | "executing">();
  const [txResult, setTxResult] = useState<TxResult>();
  const [hasVoted, setHasVoted] = useState(false);

  const [txFee, setTxFee] = useState("0");
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";

  const [proposal, setProposal] = useState<DsoProposalResponse>();
  const isProposalNotExpired = proposal
    ? new Date(parseInt(proposal.expires.at_time, 10) / 1000000) > new Date()
    : false;
  const proposalAddMembers = proposal?.proposal.add_remove_non_voting_members?.add;
  const proposalRemoveMembers = proposal?.proposal.add_remove_non_voting_members?.remove;
  const proposalAddVotingMembers = proposal?.proposal.add_voting_members?.voters;
  const proposalPunishVotingMember = proposal?.proposal.punish_members?.[0] ?? undefined;
  const proposalEditDso = proposal?.proposal.edit_trusted_circle;
  const proposalWhitelistPair = proposal?.proposal.whitelist_contract;

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
      if (!client || !proposalId) return;

      try {
        const dsoContract = new DsoContractQuerier(dsoAddress, client);
        const proposal = await dsoContract.getProposal(proposalId);
        setProposal(proposal);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, dsoAddress, handleError, proposalId]);

  useEffect(() => {
    (async function queryVoter() {
      if (!address || !client || !proposalId) return;

      try {
        const dsoContract = new DsoContractQuerier(dsoAddress, client);
        const voter = await dsoContract.getVote(proposalId, address);
        setHasVoted(voter.vote?.voter === address);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, address, dsoAddress, handleError, proposalId]);

  useEffect(() => {
    (async function queryMembership() {
      if (!client || !address) return;

      try {
        const dsoContract = new DsoContractQuerier(dsoAddress, client);
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
  }, [address, client, dsoAddress, handleError]);

  function resetModal() {
    closeModal();
    setTxResult(undefined);
    refreshProposals();
  }

  async function submitVoteProposal(chosenVote: VoteOption) {
    if (!signingClient || !address || !proposalId) return;
    setSubmitting(chosenVote);

    try {
      const dsoContract = new DsoContract(dsoAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.voteProposal(address, proposalId, chosenVote);

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
    if (!signingClient || !address || !proposalId) return;
    setSubmitting("executing");

    try {
      const dsoContract = new DsoContract(dsoAddress, signingClient, config.gasPrice);
      const transactionHash = await dsoContract.executeProposal(address, proposalId);

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
            <span>Go to Trusted Circle details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <Stack gap="s1">
          <ModalHeader>
            {proposal ? (
              <Stack gap="s1">
                <Title>
                  Nº {proposal.id} "{getProposalTitle(proposal.proposal)}"
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
                <ProposalEditDso proposalEditDso={proposalEditDso} />
                <ProposalWhitelistPair pairAddress={proposalWhitelistPair} />
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
