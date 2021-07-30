import { EscrowStatus } from "store/models";
import { DsoContractQuerier } from "utils/dso";
import { DsosActionTypes } from "..";

export interface GetEscrowStatusRequestPayload {
  readonly dsoContract: DsoContractQuerier;
  readonly memberAddress: string;
}
export interface GetEscrowStatusRequestAction {
  readonly type: typeof DsosActionTypes.GET_ESCROW_STATUS_REQUEST;
  readonly payload: GetEscrowStatusRequestPayload;
}
export const actionGetEscrowStatusRequest = (
  payload: GetEscrowStatusRequestPayload,
): GetEscrowStatusRequestAction => ({
  type: DsosActionTypes.GET_ESCROW_STATUS_REQUEST,
  payload,
});

export interface GetEscrowStatusSuccessPayload {
  readonly dsoAddress: string;
  readonly escrowStatus?: EscrowStatus;
}
export interface GetEscrowStatusSuccessAction {
  readonly type: typeof DsosActionTypes.GET_ESCROW_STATUS_SUCCESS;
  readonly payload: GetEscrowStatusSuccessPayload;
}
export const actionGetEscrowStatusSuccess = (
  payload: GetEscrowStatusSuccessPayload,
): GetEscrowStatusSuccessAction => ({
  type: DsosActionTypes.GET_ESCROW_STATUS_SUCCESS,
  payload,
});

export interface GetEscrowStatusFailurePayload {
  readonly error: string;
}
export interface GetEscrowStatusFailureAction {
  readonly type: typeof DsosActionTypes.GET_ESCROW_STATUS_FAILURE;
  readonly payload: GetEscrowStatusFailurePayload;
}
export const actionGetEscrowStatusFailure = (
  payload: GetEscrowStatusFailurePayload,
): GetEscrowStatusFailureAction => ({
  type: DsosActionTypes.GET_ESCROW_STATUS_FAILURE,
  payload,
});

export type GetEscrowStatusActions =
  | GetEscrowStatusRequestAction
  | GetEscrowStatusSuccessAction
  | GetEscrowStatusFailureAction;
