import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { calculateFee, Coin, GasPrice } from "@cosmjs/stargate";

import { isOcProposal, isOcProposalResponse, OcProposal, OcProposalResponse } from "./oversightCommunity";

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

export interface TcResponse {
  /// Trusted Circle Name
  readonly name: string;
  /// The required escrow amount, in the default denom (utgd)
  readonly escrow_amount: string;
  readonly escrow_pending?: PendingEscrow | null;
  readonly rules: VotingRules;
}

export type Punishment = {
  readonly distribute_escrow?: {
    readonly member: string;
    readonly slashing_percentage: string;
    readonly distribution_list: readonly string[];
    readonly kick_out: boolean;
  };
} & {
  readonly burn_escrow?: {
    readonly member: string;
    readonly slashing_percentage: string;
    readonly kick_out: boolean;
  };
};

export interface TrustedCircleAdjustements {
  /// Length of voting period in days
  readonly name?: string | null;
  /// Length of voting period in days
  readonly escrow_amount?: string | null;
  /// Length of voting period in days
  readonly voting_period?: number | null;
  /// quorum requirement (0.0-1.0)
  readonly quorum?: string | null;
  /// threshold requirement (0.5-1.0)
  readonly threshold?: string | null;
  /// If true, and absolute threshold and quorum are met, we can end before voting period finished
  readonly allow_end_early?: boolean | null;
}

export interface Engagement {
  readonly member: string;
  readonly points: number;
}

export interface ValidatorPunishment {
  readonly member: string;
  readonly portion: string;
  readonly jailing_duration?: { readonly duration?: number; readonly forever?: Record<string, never> };
}

export interface ValidatorUnjail {
  readonly member: string;
}

export type TcProposal = {
  /// Apply a diff to the existing non-voting members.
  /// Remove is applied after add, so if an address is in both, it is removed

  readonly add_remove_non_voting_members?: {
    readonly remove: readonly string[];
    readonly add: readonly string[];
  };
} & {
  readonly add_voting_members?: {
    readonly voters: readonly string[];
  };
} & {
  readonly punish_members?: readonly Punishment[];
} & {
  readonly edit_trusted_circle?: TrustedCircleAdjustements;
} & {
  readonly whitelist_contract?: string;
};

export type Expiration =
  | {
      readonly at_height: number;
    }
  | {
      readonly at_time: string;
    }
  | {
      readonly never: Record<string, unknown>;
    };

/**
 * https://github.com/CosmWasm/cw-plus/blob/v0.11.1/packages/cw3/src/query.rs#L72-L86
 */
export type Cw3Status = "pending" | "open" | "rejected" | "passed" | "executed";

/**
 * A point in time in nanosecond precision (uint64).
 */
export type CosmWasmTimestamp = string;

export interface Votes {
  readonly yes: number;
  readonly no: number;
  readonly abstain: number;
  readonly veto: number;
}

/**
 * See https://github.com/confio/tgrade-contracts/blob/v0.5.2/contracts/tgrade-trusted-circle/src/msg.rs#L139-L154
 */
export interface TcProposalResponse {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly proposal: TcProposal;
  readonly status: Cw3Status;
  /**
   * An Expiration from cw_utils but we only implement the at_time case here 🤞.
   * https://github.com/CosmWasm/cw-plus/blob/main/packages/utils/src/expiration.rs
   */
  readonly expires: {
    readonly at_time: CosmWasmTimestamp;
  };
  /// This is the threshold that is applied to this proposal. Both the rules of the voting contract,
  /// as well as the total_points of the voting group may have changed since this time. That means
  /// that the generic `Threshold{}` query does not provide valid information for existing proposals.
  readonly rules: VotingRules;
  readonly total_points: number;
  /// This is a running tally of all votes cast on this proposal so far.
  readonly votes: Votes;
}

export interface TcProposeResponse {
  readonly txHash: string;
  readonly proposalId?: number;
}

export function isTcProposal(proposal: TcProposal & OcProposal): proposal is TcProposal {
  return !isOcProposal(proposal);
}

export function isTcProposalResponse(
  response: TcProposalResponse | OcProposalResponse,
): response is TcProposalResponse {
  return !isOcProposalResponse(response);
}

export interface ProposalListResponse {
  readonly proposals: readonly TcProposalResponse[];
}

export type VoteOption = "yes" | "no" | "abstain";

export interface VoteInfo {
  readonly voter: string;
  readonly vote: VoteOption;
  readonly proposal_id: number;
  readonly points: number;
}

export interface VoteResponse {
  readonly vote?: VoteInfo | null;
}

export interface VoteListResponse {
  readonly votes: readonly VoteInfo[];
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
  /// If true, no further adjustments may happen.
  readonly edit_trusted_circle_disabled: boolean;
  /// Distributed reward denom
  readonly reward_denom: string;
}

export function getProposalTitle(proposal: TcProposal): string {
  const proposalProp = Object.keys(proposal)[0];

  switch (proposalProp) {
    case "add_remove_non_voting_members":
      return proposal.add_remove_non_voting_members?.add.length ? "Add participants" : "Remove participants";
    case "add_voting_members":
      return "Add voting participants";
    case "punish_members":
      return "Punish voting participant";
    case "edit_trusted_circle":
      return "Edit Trusted Circle";
    case "whitelist_contract":
      return "Whitelist pair";
    default:
      return "Uknown proposal type";
  }
}

export class TcContractQuerier {
  readonly address: string;
  protected readonly client: CosmWasmClient;

  constructor(address: string, client: CosmWasmClient) {
    this.address = address;
    this.client = client;
  }

  async getTc(): Promise<TcResponse> {
    const query = { trusted_circle: {} };
    const response: TcResponse = await this.client.queryContractSmart(this.address, query);
    return response;
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
    const response: EscrowResponse = await this.client.queryContractSmart(this.address, query);
    return response;
  }

  async getProposals(startAfter?: number): Promise<readonly TcProposalResponse[]> {
    const query = { list_proposals: { start_after: startAfter } };
    const { proposals }: ProposalListResponse = await this.client.queryContractSmart(this.address, query);
    return proposals;
  }

  async getAllProposals(): Promise<readonly TcProposalResponse[]> {
    let proposals: readonly TcProposalResponse[] = [];
    let nextProposals: readonly TcProposalResponse[] = [];

    do {
      const lastProposalId = proposals[proposals.length - 1]?.id;
      nextProposals = await this.getProposals(lastProposalId);
      proposals = [...proposals, ...nextProposals];
    } while (nextProposals.length);

    return proposals;
  }

  async getProposal(proposalId: number): Promise<TcProposalResponse> {
    const query = { proposal: { proposal_id: proposalId } };
    const proposalResponse: TcProposalResponse = await this.client.queryContractSmart(this.address, query);
    return proposalResponse;
  }

  async getVotes(proposalId: number, startAfter?: string): Promise<readonly VoteInfo[]> {
    const query = {
      list_votes: {
        proposal_id: proposalId,
        start_after: startAfter,
      },
    };
    const { votes }: VoteListResponse = await this.client.queryContractSmart(this.address, query);
    return votes;
  }

  async getAllVotes(proposalId: number): Promise<readonly VoteInfo[]> {
    let votes: readonly VoteInfo[] = [];
    let nextVotes: readonly VoteInfo[] = [];

    do {
      const lastVoterAddress = votes[votes.length - 1]?.voter;
      nextVotes = await this.getVotes(proposalId, lastVoterAddress);
      votes = [...votes, ...nextVotes];
    } while (nextVotes.length);

    return votes;
  }

  async getVote(proposalId: number, voter: string): Promise<VoteResponse> {
    const query = { vote: { proposal_id: proposalId, voter } };
    const voteResponse: VoteResponse = await this.client.queryContractSmart(this.address, query);
    return voteResponse;
  }
}

export class TcContract extends TcContractQuerier {
  static readonly GAS_CREATE_TC = 500_000;
  static readonly GAS_DEPOSIT_ESCROW = 200_000;
  static readonly GAS_RETURN_ESCROW = 200_000;
  static readonly GAS_CHECK_PENDING = 500_000;
  static readonly GAS_LEAVE_TC = 200_000;
  static readonly GAS_PROPOSE = 200_000;
  static readonly GAS_VOTE = 200_000;
  static readonly GAS_EXECUTE = 500_000;

  readonly #signingClient: SigningCosmWasmClient;
  readonly #gasPrice: GasPrice;

  constructor(address: string, signingClient: SigningCosmWasmClient, gasPrice: GasPrice) {
    super(address, signingClient);
    this.#signingClient = signingClient;
    this.#gasPrice = gasPrice;
  }

  static async createTc(
    signingClient: SigningCosmWasmClient,
    codeId: number,
    creatorAddress: string,
    tcName: string,
    escrowAmount: string,
    votingDuration: string,
    quorum: string,
    threshold: string,
    members: readonly string[],
    allowEndEarly: boolean,
    funds: readonly Coin[],
    gasPrice: GasPrice,
  ): Promise<string> {
    const msg: InstantiateMsg = {
      name: tcName,
      escrow_amount: escrowAmount,
      voting_period: parseInt(votingDuration, 10),
      quorum: (parseFloat(quorum) / 100).toString(),
      threshold: (parseFloat(threshold) / 100).toString(),
      initial_members: members,
      allow_end_early: allowEndEarly,
      edit_trusted_circle_disabled: false, // TODO: revisit what makes sense here
      reward_denom: "utgd",
    };

    const { contractAddress } = await signingClient.instantiate(
      creatorAddress,
      codeId,
      msg as unknown as Record<string, unknown>,
      tcName,
      calculateFee(TcContract.GAS_CREATE_TC, gasPrice),
      {
        admin: creatorAddress,
        funds: funds,
      },
    );
    return contractAddress;
  }

  async depositEscrow(senderAddress: string, funds: readonly Coin[]): Promise<string> {
    const msg = { deposit_escrow: {} };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.address,
      msg,
      calculateFee(TcContract.GAS_DEPOSIT_ESCROW, this.#gasPrice),
      undefined,
      funds,
    );
    return transactionHash;
  }

  async returnEscrow(memberAddress: string): Promise<string> {
    const msg = { return_escrow: {} };
    const { transactionHash } = await this.#signingClient.execute(
      memberAddress,
      this.address,
      msg,
      calculateFee(TcContract.GAS_RETURN_ESCROW, this.#gasPrice),
    );
    return transactionHash;
  }

  async checkPending(memberAddress: string): Promise<string> {
    const msg = { check_pending: {} };
    const { transactionHash } = await this.#signingClient.execute(
      memberAddress,
      this.address,
      msg,
      calculateFee(TcContract.GAS_CHECK_PENDING, this.#gasPrice),
    );
    return transactionHash;
  }

  async leaveTc(memberAddress: string): Promise<string> {
    const msg = { leave_trusted_circle: {} };
    const { transactionHash } = await this.#signingClient.execute(
      memberAddress,
      this.address,
      msg,
      calculateFee(TcContract.GAS_LEAVE_TC, this.#gasPrice),
    );
    return transactionHash;
  }

  async propose(
    senderAddress: string,
    description: string,
    proposal: TcProposal,
  ): Promise<TcProposeResponse> {
    const title = getProposalTitle(proposal);
    const msg = { propose: { title, description, proposal } };

    const result = await this.#signingClient.execute(
      senderAddress,
      this.address,
      msg,
      calculateFee(TcContract.GAS_PROPOSE, this.#gasPrice),
    );

    const proposalIdAttr = result.logs
      .flatMap((log) => log.events)
      .flatMap((event) => event.attributes)
      .find((attr) => attr.key === "proposal_id");

    const proposalId = proposalIdAttr ? parseInt(proposalIdAttr.value, 10) : undefined;

    return { txHash: result.transactionHash, proposalId };
  }

  async voteProposal(senderAddress: string, proposalId: number, vote: VoteOption): Promise<string> {
    const msg = { vote: { proposal_id: proposalId, vote } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.address,
      msg,
      calculateFee(TcContract.GAS_VOTE, this.#gasPrice),
    );
    return transactionHash;
  }

  async executeProposal(senderAddress: string, proposalId: number): Promise<string> {
    const msg = { execute: { proposal_id: proposalId } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.address,
      msg,
      calculateFee(TcContract.GAS_EXECUTE, this.#gasPrice),
    );
    return transactionHash;
  }
}
