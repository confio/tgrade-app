import { createSelector } from "reselect";
import { DsoModel, EscrowStatus, MemberModel, ProposalModel } from "../models";
import { DsosState } from "../reducers/dsosReducer";

export const dsosSelector = (state: DsosState): readonly DsoModel[] => state.dsos;

/*
    Reselect does not support param passing (dsoAddress), so I turned this
    selector into a factory. This may hinder reselct's memoization. Maybe
    we need to use useMemo from component.
*/
export const dsoSelector = createSelector(dsosSelector, (dsos) => (dsoAddress: string):
  | DsoModel
  | undefined => {
  const dso = dsos.find(({ address }) => address === dsoAddress);
  return dso;
});

export const membersSelector = createSelector(
  dsoSelector,
  (selectDso) => (dsoAddress: string): readonly MemberModel[] => {
    const dso = selectDso(dsoAddress);
    return dso?.members ?? [];
  },
);

export const escrowStatusSelector = createSelector(dsoSelector, (selectDso) => (dsoAddress: string):
  | EscrowStatus
  | undefined => {
  const dso = selectDso(dsoAddress);
  return dso?.escrowStatus;
});

export const proposalsSelector = createSelector(
  dsoSelector,
  (selectDso) => (dsoAddress: string): readonly ProposalModel[] => {
    const dso = selectDso(dsoAddress);
    return dso?.proposals ?? [];
  },
);

export const proposalSelector = createSelector(
  proposalsSelector,
  (selectProposals) => (dsoAddress: string, proposalId: number): ProposalModel | undefined => {
    const proposals = selectProposals(dsoAddress);
    const proposal = proposals.find(({ id }) => id === proposalId);
    return proposal;
  },
);
