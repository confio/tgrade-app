import { ProposalContent } from "utils/dso";

export function dsoComparator({ name: nameA }: DsoModel, { name: nameB }: DsoModel): 1 | -1 | 0 {
  if (nameA < nameB) {
    return -1;
  }
  if (nameB > nameA) {
    return 1;
  }
  return 0;
}

export function getProposalTypeFromContent(proposalContent: ProposalContent): ProposalType {
  if (proposalContent.add_remove_non_voting_members) {
    return { type: "add_remove_non_voting_members", ...proposalContent.add_remove_non_voting_members };
  }
  if (proposalContent.add_voting_members) {
    return { type: "add_voting_members", ...proposalContent.add_voting_members };
  }

  return {
    type: "edit_dso",
    name: proposalContent.edit_dso?.name ?? undefined,
    escrowAmount: proposalContent.edit_dso?.escrow_amount ?? undefined,
    votingPeriod: proposalContent.edit_dso?.voting_period ?? undefined,
    quorum: proposalContent.edit_dso?.quorum ?? undefined,
    threshold: proposalContent.edit_dso?.threshold ?? undefined,
    allowEndEarly: proposalContent.edit_dso?.allow_end_early ?? undefined,
  };
}

export interface DsoModel {
  readonly address: string;
  readonly name: string;
  readonly rules: VotingRules;
  readonly escrowAmount: string;
  readonly escrowStatus?: EscrowStatus;
  readonly members?: readonly MemberModel[];
  readonly proposals?: readonly ProposalModel[];
}

export interface VotingRules {
  readonly votingPeriod: number;
  readonly quorum: string;
  readonly threshold: string;
  readonly allowEndEarly: boolean;
}

export interface EscrowStatus {
  readonly paid: string;
  readonly status: MemberStatus;
}

export type MemberStatus = {
  readonly non_voting: Record<string, unknown>;
} & {
  readonly pending: { readonly batch_id: number };
} & {
  readonly pending_paid: { readonly batch_id: number };
} & {
  readonly voting: Record<string, unknown>;
} & {
  readonly leaving: { readonly claim_at: number };
};

export interface MemberModel {
  readonly addr: string;
  readonly weight: number;
}

export interface ProposalModel {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly proposal: ProposalType;
  readonly status: ProposalStatus;
  readonly expires: Expiration;
  readonly rules: VotingRules;
  readonly totalWeight: number;
  readonly votes: Votes;
  readonly currentVote?: VoteInfo;
}

export type ProposalType = ProposalAddRemoveNonVotingMembers | ProposalAddVotingMembers | ProposalEditDso;

export interface ProposalAddRemoveNonVotingMembers {
  readonly type: "add_remove_non_voting_members";
  readonly remove: readonly string[];
  readonly add: readonly string[];
}

export interface ProposalAddRemoveNonVotingMembers {
  readonly type: "add_remove_non_voting_members";
  readonly remove: readonly string[];
  readonly add: readonly string[];
}

export interface ProposalAddVotingMembers {
  readonly type: "add_voting_members";
  readonly voters: readonly string[];
}

export interface ProposalEditDso {
  readonly type: "edit_dso";
  readonly name?: string;
  readonly escrowAmount?: string;
  readonly votingPeriod?: number;
  readonly quorum?: string;
  readonly threshold?: string;
  readonly allowEndEarly?: boolean;
}

export type ProposalStatus = "pending" | "open" | "rejected" | "passed" | "executed";

export interface Expiration {
  readonly atTime: string;
}

export interface Votes {
  readonly yes: number;
  readonly no: number;
  readonly abstain: number;
  readonly veto: number;
}

export interface VoteInfo {
  readonly voter: string;
  readonly vote: VoteOption;
  readonly proposalId: number;
  readonly weight: number;
}

export type VoteOption = "yes" | "no" | "abstain";
