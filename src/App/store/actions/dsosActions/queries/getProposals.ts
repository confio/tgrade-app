import { ProposalModel } from "store/models";
import { DsoContractQuerier } from "utils/dso";
import { DsosActionTypes } from "..";

export interface GetProposalsRequestPayload {
  readonly dsoContract: DsoContractQuerier;
}
export interface GetProposalsRequestAction {
  readonly type: typeof DsosActionTypes.GET_PROPOSALS_REQUEST;
  readonly payload: GetProposalsRequestPayload;
}
export const actionGetProposalsRequest = (
  payload: GetProposalsRequestPayload,
): GetProposalsRequestAction => ({
  type: DsosActionTypes.GET_PROPOSALS_REQUEST,
  payload,
});

export interface GetProposalsSuccessPayload {
  readonly dsoAddress: string;
  readonly proposals: readonly ProposalModel[];
}
export interface GetProposalsSuccessAction {
  readonly type: typeof DsosActionTypes.GET_PROPOSALS_SUCCESS;
  readonly payload: GetProposalsSuccessPayload;
}
export const actionGetProposalsSuccess = (
  payload: GetProposalsSuccessPayload,
): GetProposalsSuccessAction => ({
  type: DsosActionTypes.GET_PROPOSALS_SUCCESS,
  payload,
});

export interface GetProposalsFailurePayload {
  readonly error: string;
}
export interface GetProposalsFailureAction {
  readonly type: typeof DsosActionTypes.GET_PROPOSALS_FAILURE;
  readonly payload: GetProposalsFailurePayload;
}
export const actionGetProposalsFailure = (
  payload: GetProposalsFailurePayload,
): GetProposalsFailureAction => ({
  type: DsosActionTypes.GET_PROPOSALS_FAILURE,
  payload,
});

export type GetProposalsActions =
  | GetProposalsRequestAction
  | GetProposalsSuccessAction
  | GetProposalsFailureAction;
