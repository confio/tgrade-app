import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DsoModel } from "App/store/models";
import { DsosActionTypes } from "..";

export interface GetDsosRequestPayload {
  readonly userAddress: string;
  readonly client: CosmWasmClient;
}
export interface GetDsosRequestAction {
  readonly type: typeof DsosActionTypes.GET_DSOS_REQUEST;
  readonly payload: GetDsosRequestPayload;
}
export const actionGetDsosRequest = (payload: GetDsosRequestPayload): GetDsosRequestAction => ({
  type: DsosActionTypes.GET_DSOS_REQUEST,
  payload,
});

export interface GetDsosSuccessPayload {
  readonly dsos: readonly DsoModel[];
}
export interface GetDsosSuccessAction {
  readonly type: typeof DsosActionTypes.GET_DSOS_SUCCESS;
  readonly payload: GetDsosSuccessPayload;
}
export const actionGetDsosSuccess = (payload: GetDsosSuccessPayload): GetDsosSuccessAction => ({
  type: DsosActionTypes.GET_DSOS_SUCCESS,
  payload,
});

export type GetDsosActions = GetDsosRequestAction | GetDsosSuccessAction;
