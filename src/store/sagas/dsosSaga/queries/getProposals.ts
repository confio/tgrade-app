import { call, CallEffect, put, PutEffect } from "redux-saga/effects";
import {
  actionGetProposalsFailure,
  actionGetProposalsSuccess,
  GetProposalsFailureAction,
  GetProposalsRequestAction,
  GetProposalsSuccessAction,
} from "store/actions";
import { getProposalTypeFromContent, ProposalModel } from "store/models";
import { DsoContractQuerier } from "utils/dso";

async function getProposals(dsoContract: DsoContractQuerier): Promise<readonly ProposalModel[]> {
  const proposalResponses = await dsoContract.getProposals();

  const proposals = proposalResponses.map(
    ({ id, title, description, proposal, status, expires, rules, total_weight, votes }): ProposalModel => {
      return {
        id,
        title,
        description,
        proposal: getProposalTypeFromContent(proposal),
        status,
        expires: { atTime: expires.at_time },
        rules: {
          votingPeriod: rules.voting_period,
          quorum: rules.quorum,
          threshold: rules.threshold,
          allowEndEarly: rules.allow_end_early,
        },
        totalWeight: total_weight,
        votes,
      };
    },
  );

  return proposals;
}

export function* getProposalsSaga(
  action: GetProposalsRequestAction,
): Generator<
  | CallEffect<readonly ProposalModel[]>
  | PutEffect<GetProposalsSuccessAction>
  | PutEffect<GetProposalsFailureAction>,
  void,
  readonly ProposalModel[]
> {
  try {
    const dsoAddress = action.payload.dsoContract.address;
    const proposals: readonly ProposalModel[] = yield call(getProposals, action.payload.dsoContract);
    yield put(actionGetProposalsSuccess({ dsoAddress, proposals }));
  } catch (e) {
    yield put(actionGetProposalsFailure({ error: e.message }));
  }
}
