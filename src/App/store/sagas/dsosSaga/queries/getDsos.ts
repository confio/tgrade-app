import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { call, CallEffect, put, PutEffect } from "redux-saga/effects";
import { actionGetDsosSuccess, GetDsosRequestAction, GetDsosSuccessAction } from "App/store/actions";
import { dsoComparator, DsoModel } from "App/store/models";
import { DsoContractQuerier } from "utils/dso";

type DsoAddressesByUserMap = Map<string, readonly string[]>;
const storedWalletKey = "dso-addresses";
const guestKey = "guest";
function getDsoAddressesMap(): DsoAddressesByUserMap {
  const dsoAddressesString = localStorage.getItem(storedWalletKey);
  if (!dsoAddressesString) return new Map();

  const dsoAddressesMap: DsoAddressesByUserMap = new Map(JSON.parse(dsoAddressesString));
  return dsoAddressesMap;
}
function getDsoAddresses(userAddress: string): readonly string[] {
  const dsoAddressesMap = getDsoAddressesMap();
  const dsoAddresses = dsoAddressesMap.get(userAddress || guestKey) ?? [];
  return dsoAddresses;
}
function setDsoAddresses(userAddress: string, dsoAddresses: readonly string[]): void {
  const dsoAddressesMap = getDsoAddressesMap();
  dsoAddressesMap.set(userAddress || guestKey, dsoAddresses);
  const dsoAddressesString = JSON.stringify(Array.from(dsoAddressesMap.entries()));
  localStorage.setItem(storedWalletKey, dsoAddressesString);
}

async function getDsos(userAddress: string, client: CosmWasmClient): Promise<readonly DsoModel[]> {
  const dsoAddresses = getDsoAddresses(userAddress);

  const dsoPromises: Promise<DsoModel>[] = dsoAddresses.map((dsoAddress) => {
    const dsoContract = new DsoContractQuerier(dsoAddress, client);
    return dsoContract.getDso().then(
      ({ name, escrow_amount, rules }): DsoModel => ({
        address: dsoAddress,
        name,
        escrowAmount: escrow_amount,
        rules: {
          votingPeriod: rules.voting_period,
          quorum: rules.quorum,
          threshold: rules.threshold,
          allowEndEarly: rules.allow_end_early,
        },
      }),
    );
  });

  const dsos = await Promise.allSettled(dsoPromises).then((results) => {
    const rejectedResults = results.filter((result) => result.status === "rejected");
    const fulfilledResults = results.filter(
      (result): result is PromiseFulfilledResult<DsoModel> => result.status === "fulfilled",
    );

    if (rejectedResults.length) {
      const dsoAddresses = fulfilledResults.map((result) => result.value.address);
      setDsoAddresses(userAddress, dsoAddresses);
    }

    const dsos = fulfilledResults.map((result) => result.value).sort(dsoComparator);
    return dsos;
  });

  return dsos;
}

export function* getDsosSaga(
  action: GetDsosRequestAction,
): Generator<CallEffect<readonly DsoModel[]> | PutEffect<GetDsosSuccessAction>, void, readonly DsoModel[]> {
  const dsos: readonly DsoModel[] = yield call(getDsos, action.payload.userAddress, action.payload.client);
  yield put(actionGetDsosSuccess({ dsos }));
}
