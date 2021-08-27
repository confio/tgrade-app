import { calculateFee } from "@cosmjs/stargate";
import { ReactComponent as AbstainIcon } from "App/assets/icons/abstain-icon.svg";
import closeIcon from "App/assets/icons/cross.svg";
import { ReactComponent as RejectIcon } from "App/assets/icons/no-icon.svg";
import { ReactComponent as StatusExecutedIcon } from "App/assets/icons/status-executed-icon.svg";
import { ReactComponent as StatusOpenIcon } from "App/assets/icons/status-open-icon.svg";
import { ReactComponent as StatusPassedIcon } from "App/assets/icons/status-passed-icon.svg";
import { ReactComponent as AcceptIcon } from "App/assets/icons/yes-icon.svg";
import modalBg from "App/assets/images/modal-background.jpg";
import AddressList from "App/components/AddressList";
import Button from "App/components/Button";
import ShowTxResult, { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import { DsoHomeParams } from "App/pages/DsoHome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { getDisplayAmountFromFee } from "utils/currency";
import { DsoContract, DsoContractQuerier, VoteOption } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";
import {
  AbstainedButton,
  AcceptButton,
  ButtonGroup,
  ChangedField,
  ExecuteButton,
  FeeWrapper,
  FieldGroup,
  ModalHeader,
  Paragraph,
  RejectButton,
  SectionWrapper,
  Separator,
  StyledModal,
  Text,
  TextLabel,
  TextValue,
  Title,
} from "./style";

interface ProposalDetailModalProps {
  readonly isModalOpen: boolean;
  readonly closeModal: () => void;
  readonly proposalId: number | undefined;
  readonly refreshProposals: () => void;
}

export default function ProposalDetailModal({
  isModalOpen,
  closeModal,
  proposalId,
  refreshProposals,
}: ProposalDetailModalProps): JSX.Element {
  const { dsoAddress }: DsoHomeParams = useParams();
  const { handleError } = useError();
  const {
    sdkState: { config, client, address, signingClient },
  } = useSdk();

  const [submitting, setSubmitting] = useState<VoteOption | "executing">();
  const [txResult, setTxResult] = useState<TxResult>();

  const [txFee, setTxFee] = useState("0");
  const feeTokenDenom = config.coinMap[config.feeToken].denom || "";

  const [proposal, setProposal] = useState<any>();
  const isProposalNotExpired = proposal ? new Date(proposal.expires.at_time / 1000000) > new Date() : false;
  const proposalAddMembers = proposal?.proposal["add_remove_non_voting_members"]?.add;
  const proposalRemoveMembers = proposal?.proposal["add_remove_non_voting_members"]?.remove;
  const proposalAddVotingMembers = proposal?.proposal["add_voting_members"]?.voters;
  const proposalEditDso = proposal?.proposal["edit_dso"];

  const [membership, setMembership] = useState<"participant" | "pending" | "voting">("participant");

  useEffect(() => {
    if (!signingClient) return;

    try {
      const fee = calculateFee(DsoContract.GAS_VOTE, config.gasPrice);
      const txFee = getDisplayAmountFromFee(fee, config);
      setTxFee(txFee);
    } catch (error) {
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
        handleError(error);
      }
    })();
  }, [client, dsoAddress, handleError, proposalId]);

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
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(undefined);
    }
  }

  function calculateTotalVotes(): number {
    return proposal?.votes.yes + proposal?.votes.no + proposal?.votes.abstain;
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
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setSubmitting(undefined);
    }
  }

  const canUserVote =
    address &&
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
        maxWidth: "63.25rem",
        paddingRight: "60px",
      }}
      bodyStyle={{
        position: "relative",
        padding: "var(--s1)",
        backgroundColor: txResult ? "transparent" : "var(--bg-body)",
      }}
      maskStyle={{
        background: `linear-gradient(0deg, rgba(4, 119, 120, 0.9), rgba(4, 119, 120, 0.9)), url(${modalBg})`,
        backgroundSize: "cover",
      }}
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
                <FieldGroup>
                  {proposalEditDso?.name ? (
                    <ChangedField>
                      <TextLabel>Trusted Circle name</TextLabel>
                      <TextValue>{proposalEditDso.name}</TextValue>
                    </ChangedField>
                  ) : null}
                  {proposalEditDso?.quorum ? (
                    <ChangedField>
                      <TextLabel>Quorum</TextLabel>
                      <TextValue>{parseFloat(proposalEditDso.quorum) * 100}%</TextValue>
                    </ChangedField>
                  ) : null}
                  {proposalEditDso?.threshold ? (
                    <ChangedField>
                      <TextLabel>Threshold</TextLabel>
                      <TextValue>{parseFloat(proposalEditDso.threshold) * 100}%</TextValue>
                    </ChangedField>
                  ) : null}
                  {proposalEditDso?.["voting_duration"] ? (
                    <ChangedField>
                      <TextLabel>Voting duration</TextLabel>
                      <TextValue>{proposalEditDso["voting_duration"]}</TextValue>
                    </ChangedField>
                  ) : null}
                  {proposalEditDso?.["escrow_amount"] ? (
                    <ChangedField>
                      <TextLabel>Escrow amount</TextLabel>
                      <TextValue>{proposalEditDso["escrow_amount"]}</TextValue>
                    </ChangedField>
                  ) : null}
                  {proposalEditDso?.["allow_end_early"] !== undefined &&
                  proposalEditDso?.["allow_end_early"] !== null ? (
                    <ChangedField>
                      <TextLabel>Early pass</TextLabel>
                      <TextValue>{proposalEditDso["allow_end_early"] ? "Enabled" : "Disabled"}</TextValue>
                    </ChangedField>
                  ) : null}
                </FieldGroup>
                <AddressList addresses={proposalAddMembers} short copyable />
                <AddressList addresses={proposalRemoveMembers} short copyable />
                <AddressList addresses={proposalAddVotingMembers} short copyable />
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
                    Yes: <b>{proposal.votes.yes}</b>
                  </Paragraph>
                  <Paragraph>
                    No: <b>{proposal.votes.no}</b>
                  </Paragraph>
                  <Paragraph>
                    Abstain: <b>{proposal.votes.abstain}</b>
                  </Paragraph>
                </SectionWrapper>
              </SectionWrapper>
              <Separator />
              <SectionWrapper>
                <Text>Voting Rules</Text>
                <SectionWrapper>
                  {proposalEditDso?.quorum ? (
                    <ChangedField>
                      <Paragraph>
                        Quorum: <b>{parseFloat(proposalEditDso.quorum) * 100}%</b>
                      </Paragraph>
                    </ChangedField>
                  ) : null}
                  {proposalEditDso?.threshold ? (
                    <Paragraph>
                      {`Threshold: > `}
                      <b>{parseFloat(proposalEditDso.threshold) * 100}%</b>
                    </Paragraph>
                  ) : null}
                  {proposalEditDso?.["voting_duration"] ? (
                    <Paragraph>
                      Voting period: <b>{proposalEditDso.voting_period} days</b>
                    </Paragraph>
                  ) : null}
                </SectionWrapper>
              </SectionWrapper>
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
