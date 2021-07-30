import { MemberModel } from "store/models";
import { DsoContractQuerier } from "utils/dso";
import { DsosActionTypes } from "..";

export interface GetMembersRequestPayload {
  readonly dsoContract: DsoContractQuerier;
}
export interface GetMembersRequestAction {
  readonly type: typeof DsosActionTypes.GET_MEMBERS_REQUEST;
  readonly payload: GetMembersRequestPayload;
}
export const actionGetMembersRequest = (payload: GetMembersRequestPayload): GetMembersRequestAction => ({
  type: DsosActionTypes.GET_MEMBERS_REQUEST,
  payload,
});

export interface GetMembersSuccessPayload {
  readonly dsoAddress: string;
  readonly members: readonly MemberModel[];
}
export interface GetMembersSuccessAction {
  readonly type: typeof DsosActionTypes.GET_MEMBERS_SUCCESS;
  readonly payload: GetMembersSuccessPayload;
}
export const actionGetMembersSuccess = (payload: GetMembersSuccessPayload): GetMembersSuccessAction => ({
  type: DsosActionTypes.GET_MEMBERS_SUCCESS,
  payload,
});

export interface GetMembersFailurePayload {
  readonly error: string;
}
export interface GetMembersFailureAction {
  readonly type: typeof DsosActionTypes.GET_MEMBERS_FAILURE;
  readonly payload: GetMembersFailurePayload;
}
export const actionGetMembersFailure = (payload: GetMembersFailurePayload): GetMembersFailureAction => ({
  type: DsosActionTypes.GET_MEMBERS_FAILURE,
  payload,
});

export type GetMembersActions = GetMembersRequestAction | GetMembersSuccessAction | GetMembersFailureAction;
