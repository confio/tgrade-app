import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { calculateFee, Coin, createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { QueryClientImpl } from "codec/confio/poe/v1beta1/query";
import { NetworkConfig } from "config/network";

import { TcProposal, TcProposalResponse } from "./trustedCircle";

/**
 * A point in time in nanosecond precision (uint64).
 */
export type CosmWasmTimestamp = string;

/**
 * See https://github.com/confio/tgrade-contracts/blob/v0.5.2/packages/utils/src/time.rs#L29-L30
 */
export type TgExpiration = CosmWasmTimestamp;

export type VoteOption = "yes" | "no" | "abstain";

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

export interface OcResponse {
  readonly name: string;
  /// The required escrow amount, in the default denom (utgd)
  readonly escrow_amount: string;
  readonly escrow_pending?: PendingEscrow | null;
  readonly rules: VotingRules;
}

export type Punishment = {
  readonly DistributeEscrow?: {
    readonly member: string;
    readonly slashing_percentage: string;
    readonly distribution_list: readonly string[];
    readonly kick_out: boolean;
  };
} & {
  readonly BurnEscrow?: {
    readonly member: string;
    readonly slashing_percentage: string;
    readonly kick_out: boolean;
  };
};

export interface OcAdjustements {
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
  readonly jailing_duration?: { duration: number } | "forever";
}

/**
 * See https://github.com/confio/tgrade-contracts/blob/v0.5.2/packages/utils/src/jailing.rs#L25-L30
 */
export type JailingDuration = any;

/**
 * See https://github.com/confio/tgrade-contracts/blob/v0.5.2/contracts/tgrade-oc-proposals/src/state.rs#L9-L21
 */
export interface OcProposal extends TcProposal {
  readonly grant_engagement?: {
    /** address of the member to grant points to */
    readonly member: string;
    readonly points: number;
  };
  readonly punish?: {
    /** address of the member to be punished */
    readonly member: string;
    /** A Decimal */
    readonly portion: string;
    readonly jailing_duration: JailingDuration | null;
  };
}

/**
 * See https://github.com/confio/tgrade-contracts/blob/v0.5.2/contracts/tgrade-oc-proposals/src/contract.rs#L215
 * and https://github.com/confio/tgrade-contracts/blob/v0.5.2/packages/voting-contract/src/state.rs#L25-L39
 */
export interface OcProposalResponse {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly proposal: OcProposal;
  readonly status: Cw3Status;
  readonly expires: TgExpiration;
  readonly rules: VotingRules;
  readonly total_weight: number;
  /// This is a running tally of all votes cast on this proposal so far.
  readonly votes: Votes;
}

export type MixedProposalResponseId = `${"tc" | "oc"}${number}`;

export type MixedProposalResponse = (TcProposalResponse | OcProposalResponse) & {
  readonly mixedId: MixedProposalResponseId;
};

export interface OcProposeResponse {
  readonly txHash: string;
  readonly proposalId?: MixedProposalResponseId;
}

export function isOcProposalResponse(
  response: TcProposalResponse | OcProposalResponse,
): response is OcProposalResponse {
  const proposal = response.proposal;
  return !!proposal.grant_engagement || !!proposal.punish;
}

export function isOcProposal(proposal: TcProposal | OcProposal): proposal is OcProposal {
  return !!proposal.grant_engagement || !!proposal.punish;
}

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

export interface Votes {
  readonly yes: number;
  readonly no: number;
  readonly abstain: number;
  readonly veto: number;
}

/**
 * https://github.com/CosmWasm/cw-plus/blob/v0.11.1/packages/cw3/src/query.rs#L72-L86
 */
export type Cw3Status = "pending" | "open" | "rejected" | "passed" | "executed";

/**
 * See https://github.com/confio/tgrade-contracts/blob/v0.5.2/contracts/tgrade-trusted-circle/src/msg.rs#L139-L154
 */

export interface ProposalListResponse {
  readonly proposals: readonly OcProposalResponse[];
}

export interface VoteInfo {
  readonly voter: string;
  readonly vote: VoteOption;
  readonly proposal_id: number;
  readonly weight: number;
}

export interface VoteResponse {
  readonly vote?: VoteInfo | null;
}

export interface VoteListResponse {
  readonly votes: readonly VoteInfo[];
}

export interface Member {
  readonly addr: string;
  readonly weight: number;
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

export function getProposalTitle(proposal: TcProposal | OcProposal): string {
  const proposalProp = Object.keys(proposal)[0];

  switch (proposalProp) {
    case "add_voting_members":
      return "Add Oversight Community members";
    case "punish_members":
      return "Punish Oversight Community member";
    case "grant_engagement":
      return "Grant Engagement Points";
    case "punish":
      return "Punish Validator";
    default:
      return "Uknown proposal type";
  }
}

export class OcContractQuerier {
  ocAddress?: string;
  ocProposalsAddress?: string;

  constructor(readonly config: NetworkConfig, protected readonly client: CosmWasmClient) {}
  protected async initAddress(): Promise<void> {
    if (this.ocAddress && this.ocProposalsAddress) return;

    const tendermintClient = await Tendermint34Client.connect(this.config.rpcUrl);
    const queryClient = new QueryClient(tendermintClient);
    const rpcClient = createProtobufRpcClient(queryClient);
    const queryService = new QueryClientImpl(rpcClient);

    const { address: ocAddress } = await queryService.ContractAddress({
      contractType: PoEContractType.OVERSIGHT_COMMUNITY,
    });
    const { address: ocProposalsAddress } = await queryService.ContractAddress({
      contractType: PoEContractType.OVERSIGHT_COMMUNITY_PROPOSALS,
    });

    this.ocAddress = ocAddress;
    this.ocProposalsAddress = ocProposalsAddress;
  }

  async getOc(): Promise<OcResponse> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");

    const query = { trusted_circle: {} };
    const response: OcResponse = await this.client.queryContractSmart(this.ocAddress, query);
    return response;
  }

  // NOTE: only gets members from Trusted Circle and not from OC Proposals
  async getMembers(startAfter?: string): Promise<readonly Member[]> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");

    const query = { list_members: { start_after: startAfter } };
    const { members }: MemberListResponse = await this.client.queryContractSmart(this.ocAddress, query);
    return members;
  }

  // NOTE: only gets voters from Trusted Circle and not from OC Proposals
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

  // NOTE: only gets voters from Trusted Circle and not from OC Proposals
  async getVotingMembers(startAfter?: string): Promise<readonly Member[]> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");

    const query = { list_voting_members: { start_after: startAfter } };
    const { members }: MemberListResponse = await this.client.queryContractSmart(this.ocAddress, query);
    return members;
  }

  // NOTE: only gets voters from Trusted Circle and not from OC Proposals
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
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");

    const query = { escrow: { addr: memberAddress } };
    const response: EscrowResponse = await this.client.queryContractSmart(this.ocAddress, query);
    return response;
  }

  async getTcProposals(startAfter?: number): Promise<readonly OcProposalResponse[]> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");

    const query = { list_proposals: { start_after: startAfter } };
    const { proposals }: ProposalListResponse = await this.client.queryContractSmart(this.ocAddress, query);
    return proposals;
  }

  async getAllTcProposals(): Promise<readonly OcProposalResponse[]> {
    let proposals: readonly OcProposalResponse[] = [];
    let nextProposals: readonly OcProposalResponse[] = [];

    do {
      const lastProposalId = proposals[proposals.length - 1]?.id;
      nextProposals = await this.getTcProposals(lastProposalId);
      proposals = [...proposals, ...nextProposals];
    } while (nextProposals.length);

    return proposals;
  }

  async getOcProposals(startAfter?: number): Promise<readonly OcProposalResponse[]> {
    await this.initAddress();
    if (!this.ocProposalsAddress) throw new Error("ocProposalsAddress was not set");

    const query = { list_proposals: { start_after: startAfter } };
    const { proposals }: ProposalListResponse = await this.client.queryContractSmart(
      this.ocProposalsAddress,
      query,
    );
    return proposals;
  }

  async getAllOcProposals(): Promise<readonly OcProposalResponse[]> {
    let proposals: readonly OcProposalResponse[] = [];
    let nextProposals: readonly OcProposalResponse[] = [];

    do {
      const lastProposalId = proposals[proposals.length - 1]?.id;
      nextProposals = await this.getOcProposals(lastProposalId);
      proposals = [...proposals, ...nextProposals];
    } while (nextProposals.length);

    return proposals;
  }

  async getAllMixedProposals(): Promise<readonly MixedProposalResponse[]> {
    const responsesTuple = await Promise.all([this.getAllTcProposals(), this.getAllOcProposals()]);

    const flatResponsesWithId: readonly MixedProposalResponse[] = responsesTuple.flat().map((res) => {
      const mixedId: MixedProposalResponseId = `${isOcProposalResponse(res) ? "oc" : "tc"}${res.id}`;
      const mixedResponse: MixedProposalResponse = { ...res, mixedId };

      return mixedResponse;
    });

    return flatResponsesWithId;
  }

  async getTcProposal(proposalId: number): Promise<OcProposalResponse> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");

    const query = { proposal: { proposal_id: proposalId } };
    const proposalResponse: OcProposalResponse = await this.client.queryContractSmart(this.ocAddress, query);
    return proposalResponse;
  }

  async getOcProposal(proposalId: number): Promise<OcProposalResponse> {
    await this.initAddress();
    if (!this.ocProposalsAddress) throw new Error("ocProposalsAddress was not set");

    const query = { proposal: { proposal_id: proposalId } };
    const proposalResponse: OcProposalResponse = await this.client.queryContractSmart(
      this.ocProposalsAddress,
      query,
    );
    return proposalResponse;
  }

  async getMixedProposal(mixedId: MixedProposalResponseId): Promise<MixedProposalResponse> {
    const proposalIdType = mixedId.slice(0, 2);
    const proposalIdNumber = parseInt(mixedId.slice(2), 10);

    const proposalResponse = await (proposalIdType === "tc"
      ? this.getTcProposal(proposalIdNumber)
      : this.getOcProposal(proposalIdNumber));
    const mixedResponse: MixedProposalResponse = { ...proposalResponse, mixedId };

    return mixedResponse;
  }

  async getTcVotes(proposalId: number, startAfter: string): Promise<readonly VoteInfo[]> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");

    const query = {
      list_votes_by_proposal: {
        proposal_id: proposalId,
        start_after: startAfter,
      },
    };
    const { votes }: VoteListResponse = await this.client.queryContractSmart(this.ocAddress, query);
    return votes;
  }

  async getAllTcVotes(proposalId: number): Promise<readonly VoteInfo[]> {
    let votes: readonly VoteInfo[] = [];
    let nextVotes: readonly VoteInfo[] = [];

    do {
      const lastVoterAddress = votes[votes.length - 1]?.voter;
      nextVotes = await this.getTcVotes(proposalId, lastVoterAddress);
      votes = [...votes, ...nextVotes];
    } while (nextVotes.length);

    return votes;
  }

  async getOcVotes(proposalId: number, startAfter: string): Promise<readonly VoteInfo[]> {
    await this.initAddress();
    if (!this.ocProposalsAddress) throw new Error("ocProposalsAddress was not set");

    const query = {
      list_votes: {
        proposal_id: proposalId,
        start_after: startAfter,
      },
    };
    const { votes }: VoteListResponse = await this.client.queryContractSmart(this.ocProposalsAddress, query);
    return votes;
  }

  async getAllOcVotes(proposalId: number): Promise<readonly VoteInfo[]> {
    let votes: readonly VoteInfo[] = [];
    let nextVotes: readonly VoteInfo[] = [];

    do {
      const lastVoterAddress = votes[votes.length - 1]?.voter;
      nextVotes = await this.getOcVotes(proposalId, lastVoterAddress);
      votes = [...votes, ...nextVotes];
    } while (nextVotes.length);

    return votes;
  }

  async getAllMixedVotes(mixedId: MixedProposalResponseId): Promise<readonly VoteInfo[]> {
    const proposalIdType = mixedId.slice(0, 2);
    const proposalIdNumber = parseInt(mixedId.slice(2), 10);

    const votes = await (proposalIdType === "tc"
      ? this.getAllTcVotes(proposalIdNumber)
      : this.getAllOcVotes(proposalIdNumber));

    return votes;
  }

  async getTcVote(proposalId: number, voter: string): Promise<VoteResponse> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");

    const query = { vote: { proposal_id: proposalId, voter } };
    const voteResponse: VoteResponse = await this.client.queryContractSmart(this.ocAddress, query);
    return voteResponse;
  }

  async getOcVote(proposalId: number, voter: string): Promise<VoteResponse> {
    await this.initAddress();
    if (!this.ocProposalsAddress) throw new Error("ocProposalsAddress was not set");

    const query = { vote: { proposal_id: proposalId, voter } };
    const voteResponse: VoteResponse = await this.client.queryContractSmart(this.ocProposalsAddress, query);
    return voteResponse;
  }

  async getMixedVote(mixedId: MixedProposalResponseId, voter: string): Promise<VoteResponse> {
    const proposalIdType = mixedId.slice(0, 2);
    const proposalIdNumber = parseInt(mixedId.slice(2), 10);

    const voteResponse = await (proposalIdType === "tc"
      ? this.getTcVote(proposalIdNumber, voter)
      : this.getOcVote(proposalIdNumber, voter));

    return voteResponse;
  }
}

export class OcContract extends OcContractQuerier {
  static readonly GAS_CREATE_OC = 500_000;
  static readonly GAS_DEPOSIT_ESCROW = 200_000;
  static readonly GAS_RETURN_ESCROW = 200_000;
  static readonly GAS_CHECK_PENDING = 500_000;
  static readonly GAS_LEAVE_OC = 200_000;
  static readonly GAS_PROPOSE = 200_000;
  static readonly GAS_VOTE = 200_000;
  static readonly GAS_EXECUTE = 500_000;

  readonly #signingClient: SigningCosmWasmClient;

  constructor(config: NetworkConfig, signingClient: SigningCosmWasmClient) {
    super(config, signingClient);
    this.#signingClient = signingClient;
  }

  async depositEscrow(senderAddress: string, funds: readonly Coin[]): Promise<string> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");

    const msg = { deposit_escrow: {} };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.ocAddress,
      msg,
      calculateFee(OcContract.GAS_DEPOSIT_ESCROW, this.config.gasPrice),
      undefined,
      funds,
    );
    return transactionHash;
  }

  async returnEscrow(memberAddress: string): Promise<string> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");

    const msg = { return_escrow: {} };
    const { transactionHash } = await this.#signingClient.execute(
      memberAddress,
      this.ocAddress,
      msg,
      calculateFee(OcContract.GAS_RETURN_ESCROW, this.config.gasPrice),
    );
    return transactionHash;
  }

  async checkPending(memberAddress: string): Promise<string> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");

    const msg = { check_pending: {} };
    const { transactionHash } = await this.#signingClient.execute(
      memberAddress,
      this.ocAddress,
      msg,
      calculateFee(OcContract.GAS_CHECK_PENDING, this.config.gasPrice),
    );
    return transactionHash;
  }

  async leaveOc(memberAddress: string): Promise<string> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");

    const msg = { leave_trusted_circle: {} };
    const { transactionHash } = await this.#signingClient.execute(
      memberAddress,
      this.ocAddress,
      msg,
      calculateFee(OcContract.GAS_LEAVE_OC, this.config.gasPrice),
    );
    return transactionHash;
  }

  async propose(
    senderAddress: string,
    description: string,
    proposal: TcProposal | OcProposal,
  ): Promise<OcProposeResponse> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");
    if (!this.ocProposalsAddress) throw new Error("ocProposalsAddress was not set");

    const queryAddress = isOcProposal(proposal) ? this.ocProposalsAddress : this.ocAddress;

    const title = getProposalTitle(proposal);
    const msg = { propose: { title, description, proposal } };

    const result = await this.#signingClient.execute(
      senderAddress,
      queryAddress,
      msg,
      calculateFee(OcContract.GAS_PROPOSE, this.config.gasPrice),
    );

    const proposalIdAttr = result.logs
      .flatMap((log) => log.events)
      .flatMap((event) => event.attributes)
      .find((attr) => attr.key === "proposal_id");

    const proposalPrefix = isOcProposal(proposal) ? "oc" : "tc";

    const proposalId: MixedProposalResponseId | undefined = proposalIdAttr
      ? `${proposalPrefix}${parseInt(proposalIdAttr.value, 10)}`
      : undefined;

    return { txHash: result.transactionHash, proposalId };
  }

  async voteProposal(
    senderAddress: string,
    mixedId: MixedProposalResponseId,
    vote: VoteOption,
  ): Promise<string> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");
    if (!this.ocProposalsAddress) throw new Error("ocProposalsAddress was not set");

    const proposalIdType = mixedId.slice(0, 2);
    const proposalIdNumber = parseInt(mixedId.slice(2), 10);
    const queryAddress = proposalIdType === "oc" ? this.ocProposalsAddress : this.ocAddress;

    const msg = { vote: { proposal_id: proposalIdNumber, vote } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      queryAddress,
      msg,
      calculateFee(OcContract.GAS_VOTE, this.config.gasPrice),
    );
    return transactionHash;
  }

  async executeProposal(senderAddress: string, mixedId: MixedProposalResponseId): Promise<string> {
    await this.initAddress();
    if (!this.ocAddress) throw new Error("ocAddress was not set");
    if (!this.ocProposalsAddress) throw new Error("ocProposalsAddress was not set");

    const proposalIdType = mixedId.slice(0, 2);
    const proposalIdNumber = parseInt(mixedId.slice(2), 10);
    const queryAddress = proposalIdType === "oc" ? this.ocProposalsAddress : this.ocAddress;

    const msg = { execute: { proposal_id: proposalIdNumber } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      queryAddress,
      msg,
      calculateFee(OcContract.GAS_EXECUTE, this.config.gasPrice),
    );
    return transactionHash;
  }
}
