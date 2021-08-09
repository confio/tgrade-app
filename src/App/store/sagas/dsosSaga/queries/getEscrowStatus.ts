import { call, CallEffect, put, PutEffect } from "redux-saga/effects";
import {
  actionGetEscrowStatusFailure,
  actionGetEscrowStatusSuccess,
  GetEscrowStatusFailureAction,
  GetEscrowStatusRequestAction,
  GetEscrowStatusSuccessAction,
} from "App/store/actions";
import { EscrowStatus } from "App/store/models";
import { DsoContractQuerier } from "utils/dso";

async function getEscrowStatus(
  dsoContract: DsoContractQuerier,
  memberAddress: string,
): Promise<EscrowStatus | undefined> {
  const escrowStatusResponse = await dsoContract.getEscrow(memberAddress);
  if (!escrowStatusResponse) return undefined;
  return escrowStatusResponse;
}

export function* getEscrowStatusSaga(
  action: GetEscrowStatusRequestAction,
): Generator<
  | CallEffect<EscrowStatus | undefined>
  | PutEffect<GetEscrowStatusSuccessAction>
  | PutEffect<GetEscrowStatusFailureAction>,
  void,
  EscrowStatus | undefined
> {
  try {
    const { dsoContract, memberAddress } = action.payload;
    const escrowStatus: EscrowStatus | undefined = yield call(getEscrowStatus, dsoContract, memberAddress);

    const dsoAddress = dsoContract.address;
    yield put(actionGetEscrowStatusSuccess({ dsoAddress, escrowStatus }));
  } catch (e) {
    yield put(actionGetEscrowStatusFailure({ error: e.message }));
  }
}
