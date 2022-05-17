import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { calculateFee, Coin, GasPrice } from "@cosmjs/stargate";

import { getProposalTitle, InstantiateMsg, TcProposal, TcProposeResponse, VoteOption } from "./trustedCircle";

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

export class TcContract extends ArbiterPoolResponseQuerier {
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
