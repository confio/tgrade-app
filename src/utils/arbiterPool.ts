import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export interface PendingEscrow {
  /// Associated proposal_id
  readonly proposal_id: number;
  /// Pending escrow amount
  readonly amount: string;
  /// Timestamp (seconds) when the pending escrow is enforced
  readonly grace_ends_at: number;
}

export interface VotingRules {
  /// Length of voting period in days
  readonly voting_period: number;
  /// quorum requirement (0.0-1.0)
  readonly quorum: string;
  /// threshold requirement (0.5-1.0)
  readonly threshold: string;
  /// If true, and absolute threshold and quorum are met, we can end before voting period finished
  readonly allow_end_early: boolean;
}

export interface ArbiterPoolResponse {
  /// The required escrow amount, in the default denom (utgd)
  readonly escrow_amount: string;
  readonly escrow_pending?: PendingEscrow | null;
  readonly rules: VotingRules;
}

export interface Member {
  readonly addr: string;
  readonly points: number;
}

export interface MemberListResponse {
  readonly members: readonly Member[];
}

export type MemberStatus = {
  /// Normal member, not allowed to vote
  readonly non_voting?: Record<string, unknown>;
} & {
  /// Approved for voting, need to pay in
  readonly pending?: { readonly batch_id: number };
} & {
  /// Approved for voting, and paid in. Waiting for rest of batch
  readonly pending_paid?: { readonly batch_id: number };
} & {
  /// Full-fledged voting member
  readonly voting?: Record<string, unknown>;
} & {
  /// Marked as leaving. Escrow frozen until `claim_at`
  readonly leaving?: { readonly claim_at: number };
};

export interface EscrowStatus {
  /// how much escrow they have paid
  readonly paid: string;
  /// voter status. we check this to see what functionality are allowed for this member
  readonly status: MemberStatus;
}

export type EscrowResponse = EscrowStatus | null;

export interface InstantiateMsg {
  /// Trusted Circle Name
  readonly name: string;
  /// The required escrow amount, in the default denom (utgd)
  readonly escrow_amount: string;
  /// Voting period in days
  readonly voting_period: number;
  /// Default voting quorum percentage (0-100)
  readonly quorum: string;
  /// Default voting threshold percentage (0-100)
  readonly threshold: string;
  /// If true, and absolute threshold and quorum are met, we can end before voting period finished.
  /// (Recommended value: true, unless you have special needs)
  readonly allow_end_early: boolean;
  /// List of non-voting members to be added to the Trusted Circle upon creation
  readonly initial_members: readonly string[];
  /// cw4 contract with list of addresses denied to be part of TrustedCircle
  readonly deny_list?: string | null;
  /// Distributed reward denom
  readonly reward_denom: string;
}

export class ArbiterPoolResponseQuerier {
  readonly address: string;
  protected readonly client: CosmWasmClient;

  constructor(address: string, client: CosmWasmClient) {
    this.address = address;
    this.client = client;
  }

  async getArbiterPool(): Promise<ArbiterPoolResponse> {
    const query = { trusted_circle: {} };
    return await this.client.queryContractSmart(this.address, query);
  }

  async getMembers(startAfter?: string): Promise<readonly Member[]> {
    const query = { list_members: { start_after: startAfter } };
    const { members }: MemberListResponse = await this.client.queryContractSmart(this.address, query);
    return members;
  }

  async getAllMembers(): Promise<readonly Member[]> {
    let members: readonly Member[] = [];
    let nextMembers: readonly Member[] = [];

    do {
      const lastMemberAddress = members[members.length - 1]?.addr;
      nextMembers = await this.getMembers(lastMemberAddress);
      members = [...members, ...nextMembers];
    } while (nextMembers.length);

    return members;
  }

  async getVotingMembers(startAfter?: string): Promise<readonly Member[]> {
    const query = { list_voters: { start_after: startAfter } };
    const { members }: MemberListResponse = await this.client.queryContractSmart(this.address, query);
    return members;
  }

  async getNonVotingMembers(startAfter?: string): Promise<readonly Member[]> {
    const query = { list_non_voting_members: { start_after: startAfter } };
    const { members }: MemberListResponse = await this.client.queryContractSmart(this.address, query);
    return members;
  }

  async getAllVotingMembers(): Promise<readonly Member[]> {
    let votingMembers: readonly Member[] = [];
    let nextVotingMembers: readonly Member[] = [];

    do {
      const lastVotingMemberAddress = votingMembers[votingMembers.length - 1]?.addr;
      nextVotingMembers = await this.getVotingMembers(lastVotingMemberAddress);
      votingMembers = [...votingMembers, ...nextVotingMembers];
    } while (nextVotingMembers.length);

    return votingMembers;
  }

  async getEscrow(memberAddress: string): Promise<EscrowResponse> {
    const query = { escrow: { addr: memberAddress } };
    return await this.client.queryContractSmart(this.address, query);
  }
}
