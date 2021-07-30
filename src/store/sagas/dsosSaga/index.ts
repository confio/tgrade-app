import { all, AllEffect, ForkEffect, takeLatest } from "redux-saga/effects";
import { DsosActionTypes } from "store/actions";
import {
  getDsosSaga,
  getEscrowStatusSaga,
  getMembersSaga,
  getProposalSaga,
  getProposalsSaga,
} from "./queries";

export function* dsosSaga(): Generator<AllEffect<ForkEffect<never>>, void, unknown> {
  yield all([
    takeLatest(DsosActionTypes.GET_DSOS_REQUEST, getDsosSaga),
    takeLatest(DsosActionTypes.GET_ESCROW_STATUS_REQUEST, getEscrowStatusSaga),
    takeLatest(DsosActionTypes.GET_MEMBERS_REQUEST, getMembersSaga),
    takeLatest(DsosActionTypes.GET_PROPOSALS_REQUEST, getProposalsSaga),
    takeLatest(DsosActionTypes.GET_PROPOSAL_REQUEST, getProposalSaga),
  ]);
}
