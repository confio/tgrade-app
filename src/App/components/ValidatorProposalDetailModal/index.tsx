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
  ProposalResponse,
  ValidatorVotingContract,
  ValidatorVotingContractQuerier,
  VoteInfo,
  VoteOption,
} from "utils/validatorVoting";

import ButtonVote from "../ButtonVote";
import VotesTable from "../VotesTable";
import ProposalMigrateContract from "./components/ProposalMigrateContract";
import ProposalPinCodes from "./components/ProposalPinCodes";
import ProposalRegisterUpgrade from "./components/ProposalRegisterUpgrade";
import ProposalUnpinCodes from "./components/ProposalUnpinCodes";
import ProposalUpdateConsensusBlockParams from "./components/ProposalUpdateConsensusBlockParams";
import ProposalUpdateConsensusEvidenceParams from "./components/ProposalUpdateConsensusEvidenceParams";
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

interface ValidatorProposalDetailModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly proposalId: number | undefined;
  readonly refreshProposals: () => void;
}

export default function ValidatorProposalDetailModal({
  isModalOpen,
  closeModal,
  proposalId,
  refreshProposals,
}: ValidatorProposalDetailModalProps): JSX.Element {
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
    ? new Date(parseInt(proposal.expires, 10) / 1000000) > new Date()
    : false;

  const proposalRegisterUpgrade = proposal?.proposal.register_upgrade;
  const proposalPinCodes = proposal?.proposal.pin_codes;
  const proposalUnpinCodes = proposal?.proposal.unpin_codes;
  const proposalUpdateConsensusBlockParams = proposal?.proposal.update_consensus_block_params;
  const proposalUpdateConsensusEvidenceParams = proposal?.proposal.update_consensus_evidence_params;
  const proposalMigrateContract = proposal?.proposal.migrate_contract;

  const [isVotingMember, setVotingMember] = useState(false);

  const [isTableLoading, setTableLoading] = useState(false);
  const [votes, setVotes] = useState<readonly VoteInfo[]>([]);
  useEffect(() => {
    (async function queryVotes() {
      if (!client || !proposalId) return;

      try {
        const validatorContract = new ValidatorVotingContractQuerier(config, client);
        setTableLoading(true);
        const votes = await validatorContract.getAllVotes(proposalId);
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
      const fee = calculateFee(ValidatorVotingContract.GAS_PROPOSE, config.gasPrice);
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
        const validatorVotingContract = new ValidatorVotingContractQuerier(config, client);
        const proposal = await validatorVotingContract.getProposal(proposalId);
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
        const validatorVotingContract = new ValidatorVotingContractQuerier(config, client);
        const voter = await validatorVotingContract.getVote(proposalId, address);
        setHasVoted(voter.vote?.voter === address);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [address, client, config, handleError, proposalId]);

  useEffect(() => {
    (async function queryMembership() {
      if (!client || !address) return;

      try {
        const validatorVotingContract = new ValidatorVotingContractQuerier(config, client);
        const isVotingMember = (await validatorVotingContract.getAllVoters()).some(
          (voter) => voter.addr === address,
        );
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
      const validatorVotingContract = new ValidatorVotingContract(config, signingClient);
      const transactionHash = await validatorVotingContract.voteProposal(address, proposalId, chosenVote);

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
      const validatorVotingContract = new ValidatorVotingContract(config, signingClient);
      const transactionHash = await validatorVotingContract.executeProposal(address, proposalId);

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
            <span>Go to Validator details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <Stack gap="s1">
          <ModalHeader>
            {proposal ? (
              <div>
                <Title>
                  Nº {proposal.id} "{proposal.title}"
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
                <ProposalRegisterUpgrade proposalRegisterUpgrade={proposalRegisterUpgrade} />
                <ProposalPinCodes proposalPinCodes={proposalPinCodes} />
                <ProposalUnpinCodes proposalUnpinCodes={proposalUnpinCodes} />
                <ProposalUpdateConsensusBlockParams
                  proposalUpdateConsensusBlockParams={proposalUpdateConsensusBlockParams}
                />
                <ProposalUpdateConsensusEvidenceParams
                  proposalUpdateConsensusEvidenceParams={proposalUpdateConsensusEvidenceParams}
                />
                <ProposalMigrateContract proposalMigrateContract={proposalMigrateContract} />
                {proposal.proposal === "cancel_upgrade" ? (
                  <TextValue>The upgrade will be cancelled</TextValue>
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
