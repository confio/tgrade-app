import { call, CallEffect, put, PutEffect } from "redux-saga/effects";
import {
  actionGetMembersFailure,
  actionGetMembersSuccess,
  GetMembersFailureAction,
  GetMembersRequestAction,
  GetMembersSuccessAction,
} from "store/actions";
import { MemberModel } from "store/models";
import { DsoContractQuerier } from "utils/dso";

async function getMembers(dsoContract: DsoContractQuerier): Promise<readonly MemberModel[]> {
  const members = await dsoContract.getAllMembers();
  return members;
}

export function* getMembersSaga(
  action: GetMembersRequestAction,
): Generator<
  | CallEffect<readonly MemberModel[]>
  | PutEffect<GetMembersSuccessAction>
  | PutEffect<GetMembersFailureAction>,
  void,
  readonly MemberModel[]
> {
  try {
    const dsoAddress = action.payload.dsoContract.address;
    const members: readonly MemberModel[] = yield call(getMembers, action.payload.dsoContract);
    yield put(actionGetMembersSuccess({ dsoAddress, members }));
  } catch (e) {
    yield put(actionGetMembersFailure({ error: e.message }));
  }
}
