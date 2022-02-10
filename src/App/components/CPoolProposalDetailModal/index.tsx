import { calculateFee, Coin } from "@cosmjs/stargate";
import { Collapse } from "antd";
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
import {
  CommunityPoolContract,
  CommunityPoolContractQuerier,
  ProposalResponse,
  VoteInfo,
  VoteOption,
} from "utils/communityPool";
import { getDisplayAmountFromFee, nativeCoinToDisplay } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";

import AddressTag from "../AddressTag";
import VotesTable from "../VotesTable";
import {
  AbstainedButton,
  AcceptButton,
  AddressField,
  ButtonGroup,
  ExecuteButton,
  FeeWrapper,
  ModalHeader,
  Paragraph,
  RejectButton,
  SectionWrapper,
  Separator,
  StyledCollapse,
  StyledModal,
  Text,
  TextLabel,
  TextValue,
  Title,
} from "./style";

interface CPoolProposalDetailModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly proposalId: number | undefined;
  readonly refreshProposals: () => void;
}

export default function CPoolProposalDetailModal({
  isModalOpen,
  closeModal,
  proposalId,
  refreshProposals,
}: CPoolProposalDetailModalProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, client, address, signingClient },
  } = useSdk();

  const [submitting, setSubmitting] = useState<VoteOption | "executing">();
  const [txResult, setTxResult] = useState<TxResult>();
  const [hasVoted, setHasVoted] = useState(false);

  const [txFee, setTxFee] = useState("0");
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";

  const [proposal, setProposal] = useState<ProposalResponse>();
  const isProposalNotExpired = proposal
    ? new Date(parseInt(proposal.expires.at_time, 10) / 1000000) > new Date()
    : false;
  const { amount: nativeCoinToSend, to_addr: receiverAddress } = proposal?.proposal.send_proposal ?? {};
  const [isVotingMember, setVotingMember] = useState(false);
  const [coinToSend, setCoinToSend] = useState<Coin>();

  const [isTableLoading, setTableLoading] = useState(false);
  const [votes, setVotes] = useState<readonly VoteInfo[]>([]);
  useEffect(() => {
    (async function queryVotes() {
      if (!client || !proposalId) return;

      try {
        const tcContract = new CommunityPoolContractQuerier(config, client);
        setTableLoading(true);
        const votes = await tcContract.getAllVotes(proposalId);
        setVotes(votes);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      } finally {
        setTableLoading(false);
      }
    })();
  }, [client, config, handleError, proposalId]);

  useEffect(() => {
    if (!signingClient) return;

    try {
      const fee = calculateFee(CommunityPoolContract.GAS_PROPOSE, config.gasPrice);
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
        const cPoolContract = new CommunityPoolContractQuerier(config, client);
        const proposal = await cPoolContract.getProposal(proposalId);
        setProposal(proposal);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, config, handleError, proposalId]);

  useEffect(() => {
    (async function queryVoter() {
      if (!address || !client || !proposalId) return;

      try {
        const cPoolContract = new CommunityPoolContractQuerier(config, client);
        const voter = await cPoolContract.getVote(proposalId, address);
        setHasVoted(voter.vote?.voter === address);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, client, config, handleError, proposalId]);

  useEffect(() => {
    (async function formatCoin() {
      if (!nativeCoinToSend) return;

      try {
        const coinToSend = nativeCoinToDisplay(nativeCoinToSend, config.coinMap);
        setCoinToSend(coinToSend);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [config.coinMap, handleError, nativeCoinToSend]);

  useEffect(() => {
    (async function queryMembership() {
      if (!client || !address) return;

      try {
        const cPoolContract = new CommunityPoolContractQuerier(config, client);
        const isVotingMember = (await cPoolContract.getVoters()).some((voter) => voter.addr === address);
        setVotingMember(isVotingMember);
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
    if (!signingClient || !address || !proposalId) return;
    setSubmitting(chosenVote);

    try {
      const cPoolContract = new CommunityPoolContract(config, signingClient);
      const transactionHash = await cPoolContract.voteProposal(address, proposalId, chosenVote);

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
      const cPoolContract = new CommunityPoolContract(config, signingClient);
      const transactionHash = await cPoolContract.executeProposal(address, proposalId);

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
    isVotingMember &&
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
                {coinToSend && receiverAddress ? (
                  <AddressField>
                    <TextLabel>
                      Send {coinToSend.amount} {coinToSend.denom} to:
                    </TextLabel>
                    <AddressTag address={receiverAddress} />
                  </AddressField>
                ) : null}
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
                    }
                  >
                    <VotesTable isLoading={isTableLoading} votes={votes} />
                  </Collapse.Panel>
                </StyledCollapse>
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