import { ProposalModel } from "App/store/models";
import { DsoContractQuerier } from "utils/dso";
import { DsosActionTypes } from "..";

export interface GetProposalRequestPayload {
  readonly dsoContract: DsoContractQuerier;
  readonly proposalId: number;
  readonly voterAddress: string;
}
export interface GetProposalRequestAction {
  readonly type: typeof DsosActionTypes.GET_PROPOSAL_REQUEST;
  readonly payload: GetProposalRequestPayload;
}
export const actionGetProposalRequest = (payload: GetProposalRequestPayload): GetProposalRequestAction => ({
  type: DsosActionTypes.GET_PROPOSAL_REQUEST,
  payload,
});

export interface GetProposalSuccessPayload {
  readonly dsoAddress: string;
  readonly proposal: ProposalModel;
}
export interface GetProposalSuccessAction {
  readonly type: typeof DsosActionTypes.GET_PROPOSAL_SUCCESS;
  readonly payload: GetProposalSuccessPayload;
}
export const actionGetProposalSuccess = (payload: GetProposalSuccessPayload): GetProposalSuccessAction => ({
  type: DsosActionTypes.GET_PROPOSAL_SUCCESS,
  payload,
});

export interface GetProposalFailurePayload {
  readonly error: string;
}
export interface GetProposalFailureAction {
  readonly type: typeof DsosActionTypes.GET_PROPOSAL_FAILURE;
  readonly payload: GetProposalFailurePayload;
}
export const actionGetProposalFailure = (payload: GetProposalFailurePayload): GetProposalFailureAction => ({
  type: DsosActionTypes.GET_PROPOSAL_FAILURE,
  payload,
});

export type GetProposalActions =
  | GetProposalRequestAction
  | GetProposalSuccessAction
  | GetProposalFailureAction;
