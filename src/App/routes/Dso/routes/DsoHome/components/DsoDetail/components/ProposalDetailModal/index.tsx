import { Typography } from "antd";
import { AddressList, Button } from "App/components/form";
import { Stack } from "App/components/layoutPrimitives";
import ShowTxResult, { TxResult } from "App/components/logic/ShowTxResult";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useError, useSdk } from "service";
import { getDisplayAmountFromFee } from "utils/currency";
import { DsoContract, VoteOption } from "utils/dso";
import { getErrorFromStackTrace } from "utils/errors";
import { DsoHomeParams } from "../../../..";
import closeIcon from "./assets/cross.svg";
import modalBg from "./assets/modal-background.jpg";
import {
  AbstainButton,
  ButtonGroup,
  ChangedField,
  FeeGroup,
  FieldGroup,
  ModalHeader,
  NoButton,
  Separator,
  StyledModal,
  TextLabel,
  TextValue,
  YesButton,
} from "./style";

const { Title, Paragraph } = Typography;

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
    sdkState: { config, signingClient, address },
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
    try {
      const txFee = getDisplayAmountFromFee(signingClient.fees.exec, config);
      setTxFee(txFee);
    } catch (error) {
      handleError(error);
    }
  }, [config, handleError, signingClient.fees.exec]);

  useEffect(() => {
    (async function queryProposal() {
      if (!proposalId) return;

      try {
        const proposal = await DsoContract(signingClient).use(dsoAddress).proposal(proposalId);
        setProposal(proposal);
      } catch (error) {
        handleError(error);
      }
    })();
  }, [dsoAddress, handleError, proposalId, signingClient]);

  useEffect(() => {
    (async function queryMembership() {
      try {
        const escrowResponse = await DsoContract(signingClient).use(dsoAddress).escrow(address);

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
  }, [address, dsoAddress, handleError, signingClient]);

  function resetModal() {
    closeModal();
    setTxResult(undefined);
    refreshProposals();
  }

  async function submitVoteProposal(chosenVote: VoteOption) {
    if (!proposalId) return;
    setSubmitting(chosenVote);

    try {
      const transactionHash = await DsoContract(signingClient)
        .use(dsoAddress)
        .voteProposal(address, proposalId, chosenVote);

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

  async function submitExecuteProposal() {
    if (!proposalId) return;
    setSubmitting("executing");

    try {
      const transactionHash = await DsoContract(signingClient)
        .use(dsoAddress)
        .executeProposal(address, proposalId);

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
    isProposalNotExpired &&
    membership === "voting" &&
    (proposal.status === "open" || proposal.status === "passed");

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
              {canUserVote ? (
                <ButtonGroup>
                  <FeeGroup>
                    <Typography>
                      <Paragraph>Tx fee</Paragraph>
                      <Paragraph>{`~${txFee} ${feeTokenDenom}`}</Paragraph>
                    </Typography>
                    <YesButton
                      loading={submitting === "yes"}
                      disabled={submitting && submitting !== "yes"}
                      onClick={() => submitVoteProposal("yes")}
                    >
                      Yes
                    </YesButton>
                    <NoButton
                      loading={submitting === "no"}
                      disabled={submitting && submitting !== "no"}
                      onClick={() => submitVoteProposal("no")}
                    >
                      No
                    </NoButton>
                    <AbstainButton
                      loading={submitting === "abstain"}
                      disabled={submitting && submitting !== "abstain"}
                      onClick={() => submitVoteProposal("abstain")}
                    >
                      Abstain
                    </AbstainButton>
                    <Button
                      loading={submitting === "executing"}
                      disabled={submitting && submitting !== "executing"}
                      onClick={() => submitExecuteProposal()}
                    >
                      Execute
                    </Button>
                  </FeeGroup>
                </ButtonGroup>
              ) : null}
            </>
          ) : null}
        </Stack>
      )}
    </StyledModal>
  );
}
