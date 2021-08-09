import { all, AllEffect, fork, ForkEffect } from "redux-saga/effects";
import { dsosSaga } from "./dsosSaga";

export function* rootSaga(): Generator<AllEffect<ForkEffect<void>>, void, unknown> {
  yield all([fork(dsosSaga)]);
}
