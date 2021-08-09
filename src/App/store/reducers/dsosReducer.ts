import { DsosActions, DsosActionTypes } from "../actions";
import { dsoComparator, DsoModel, EscrowStatus, MemberModel, ProposalModel } from "../models";

export interface DsosState {
  readonly pending: boolean;
  readonly dsos: readonly DsoModel[];
  readonly error?: string;
}

const initialState: DsosState = { pending: false, dsos: [] };

function getDsosWithEscrowStatus(
  dsoAddress: string,
  dsos: readonly DsoModel[],
  escrowStatus?: EscrowStatus,
): readonly DsoModel[] {
  const oldDso = dsos.find(({ address }) => address === dsoAddress);
  if (!oldDso) return dsos;

  const newDso: DsoModel = { ...oldDso, escrowStatus };
  const dsosWithoutOld = dsos.filter(({ address }) => address === dsoAddress);
  const dsosWithNew = [...dsosWithoutOld, newDso].sort(dsoComparator);
  return dsosWithNew;
}

function getDsosWithMembers(
  dsoAddress: string,
  dsos: readonly DsoModel[],
  members: readonly MemberModel[],
): readonly DsoModel[] {
  const oldDso = dsos.find(({ address }) => address === dsoAddress);
  if (!oldDso) return dsos;

  const newDso: DsoModel = { ...oldDso, members };
  const dsosWithoutOld = dsos.filter(({ address }) => address === dsoAddress);
  const dsosWithNew = [...dsosWithoutOld, newDso].sort(dsoComparator);
  return dsosWithNew;
}

function getDsosWithProposals(
  dsoAddress: string,
  dsos: readonly DsoModel[],
  proposals: readonly ProposalModel[],
): readonly DsoModel[] {
  const oldDso = dsos.find(({ address }) => address === dsoAddress);
  if (!oldDso) return dsos;

  const newDso: DsoModel = { ...oldDso, proposals };
  const dsosWithoutOld = dsos.filter(({ address }) => address === dsoAddress);
  const dsosWithNew = [...dsosWithoutOld, newDso].sort(dsoComparator);
  return dsosWithNew;
}

function getDsosWithProposal(
  dsoAddress: string,
  dsos: readonly DsoModel[],
  proposal: ProposalModel,
): readonly DsoModel[] {
  const oldDso = dsos.find(({ address }) => address === dsoAddress);
  if (!oldDso) return dsos;

  const proposalsWithoutOld = oldDso.proposals?.filter(({ id }) => id === proposal.id) ?? [];
  const newProposals: readonly ProposalModel[] = [...proposalsWithoutOld, proposal];

  const newDso: DsoModel = { ...oldDso, proposals: newProposals };
  const dsosWithoutOld = dsos.filter(({ address }) => address === dsoAddress);
  const dsosWithNew = [...dsosWithoutOld, newDso].sort(dsoComparator);
  return dsosWithNew;
}

export function dsosReducer(state = initialState, action: DsosActions): DsosState {
  switch (action.type) {
    case DsosActionTypes.GET_DSOS_REQUEST:
    case DsosActionTypes.GET_ESCROW_STATUS_REQUEST:
    case DsosActionTypes.GET_PROPOSALS_REQUEST:
    case DsosActionTypes.GET_PROPOSAL_REQUEST:
      return { ...state, pending: true };
    case DsosActionTypes.GET_ESCROW_STATUS_FAILURE:
    case DsosActionTypes.GET_PROPOSALS_FAILURE:
    case DsosActionTypes.GET_PROPOSAL_FAILURE:
      return { ...state, pending: false, error: action.payload.error };
    case DsosActionTypes.GET_DSOS_SUCCESS:
      return { pending: false, dsos: action.payload.dsos };
    case DsosActionTypes.GET_ESCROW_STATUS_SUCCESS:
      return {
        pending: false,
        dsos: getDsosWithEscrowStatus(action.payload.dsoAddress, state.dsos, action.payload.escrowStatus),
      };
    case DsosActionTypes.GET_MEMBERS_SUCCESS:
      return {
        pending: false,
        dsos: getDsosWithMembers(action.payload.dsoAddress, state.dsos, action.payload.members),
      };
    case DsosActionTypes.GET_PROPOSALS_SUCCESS:
      return {
        pending: false,
        dsos: getDsosWithProposals(action.payload.dsoAddress, state.dsos, action.payload.proposals),
      };
    case DsosActionTypes.GET_PROPOSAL_SUCCESS:
      return {
        pending: false,
        dsos: getDsosWithProposal(action.payload.dsoAddress, state.dsos, action.payload.proposal),
      };
    default:
      return state;
  }
}
