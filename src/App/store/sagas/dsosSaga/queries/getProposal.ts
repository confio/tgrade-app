import { call, CallEffect, put, PutEffect } from "redux-saga/effects";
import {
  actionGetProposalFailure,
  actionGetProposalSuccess,
  GetProposalFailureAction,
  GetProposalRequestAction,
  GetProposalSuccessAction,
} from "store/actions";
import { getProposalTypeFromContent, ProposalModel } from "store/models";
import { DsoContractQuerier } from "utils/dso";

async function getProposal(
  dsoContract: DsoContractQuerier,
  proposalId: number,
  voterAddress: string,
): Promise<ProposalModel> {
  const proposalResponse = await dsoContract.getProposal(proposalId);
  const { vote } = await dsoContract.getVote(proposalId, voterAddress);

  const proposal: ProposalModel = {
    id: proposalResponse.id,
    title: proposalResponse.title,
    description: proposalResponse.description,
    proposal: getProposalTypeFromContent(proposalResponse.proposal),
    status: proposalResponse.status,
    expires: { atTime: proposalResponse.expires.at_time },
    rules: {
      votingPeriod: proposalResponse.rules.voting_period,
      quorum: proposalResponse.rules.quorum,
      threshold: proposalResponse.rules.threshold,
      allowEndEarly: proposalResponse.rules.allow_end_early,
    },
    totalWeight: proposalResponse.total_weight,
    votes: proposalResponse.votes,
    currentVote: vote ? { ...vote, proposalId: vote?.proposal_id } : undefined,
  };

  return proposal;
}

export function* getProposalSaga(
  action: GetProposalRequestAction,
): Generator<
  CallEffect<ProposalModel> | PutEffect<GetProposalSuccessAction> | PutEffect<GetProposalFailureAction>,
  void,
  ProposalModel
> {
  try {
    const { dsoContract, proposalId, voterAddress } = action.payload;
    const proposal: ProposalModel = yield call(getProposal, dsoContract, proposalId, voterAddress);

    const dsoAddress = dsoContract.address;
    yield put(actionGetProposalSuccess({ dsoAddress, proposal }));
  } catch (e) {
    yield put(actionGetProposalFailure({ error: e.message }));
  }
}
