import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { calculateFee, Coin, GasPrice } from "@cosmjs/stargate";

import { Factory } from "./factory";

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

export interface DsoResponse {
  /// DSO Name
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

export type ProposalContent = {
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
  readonly edit_trusted_circle?: {
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
  };
} & {
  readonly grant_engagement?: {
    readonly member: string;
    readonly points: number;
  };
};

export function isOcProposal(proposal: ProposalContent): boolean {
  return !!proposal.grant_engagement;
}

export type Expiration = {
  readonly at_height: number;
} & {
  readonly at_time: string;
} & {
  readonly never: Record<string, unknown>;
};

export interface Votes {
  readonly yes: number;
  readonly no: number;
  readonly abstain: number;
  readonly veto: number;
}

export interface ProposalResponse {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly proposal: ProposalContent;
  readonly status: "pending" | "open" | "rejected" | "passed" | "executed";
  readonly expires: Expiration;
  /// This is the threshold that is applied to this proposal. Both the rules of the voting contract,
  /// as well as the total_weight of the voting group may have changed since this time. That means
  /// that the generic `Threshold{}` query does not provide valid information for existing proposals.
  readonly rules: VotingRules;
  readonly total_weight: number;
  /// This is a running tally of all votes cast on this proposal so far.
  readonly votes?: Votes;
}

export interface ProposalListResponse {
  readonly proposals: readonly ProposalResponse[];
}

export interface VoteInfo {
  readonly voter: string;
  readonly vote: VoteOption;
  readonly proposal_id: number;
  readonly weight: number;
}

export interface VoteResponse {
  readonly vote: VoteInfo | null;
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
  readonly non_voting: Record<string, unknown>;
} & {
  /// Approved for voting, need to pay in
  readonly pending: { readonly batch_id: number };
} & {
  /// Approved for voting, and paid in. Waiting for rest of batch
  readonly pending_paid: { readonly batch_id: number };
} & {
  /// Full-fledged voting member
  readonly voting: Record<string, unknown>;
} & {
  /// Marked as leaving. Escrow frozen until `claim_at`
  readonly leaving: { readonly claim_at: number };
};

export interface EscrowStatus {
  /// how much escrow they have paid
  readonly paid: string;
  /// voter status. we check this to see what functionality are allowed for this member
  readonly status: MemberStatus;
}

export type EscrowResponse = EscrowStatus | null;

export interface InstantiateMsg {
  /// DSO Name
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
  /// List of non-voting members to be added to the DSO upon creation
  readonly initial_members: readonly string[];
}

export async function getProposalTitle(
  client: CosmWasmClient,
  factoryAddress: string,
  proposal: ProposalContent,
): Promise<string> {
  const proposalProp = Object.keys(proposal)[0];

  switch (proposalProp) {
    case "add_remove_non_voting_members":
      // Determine if it's whitelist
      if (proposal.add_remove_non_voting_members?.add.length === 1) {
        const address = proposal.add_remove_non_voting_members?.add[0];
        const pairs = await Factory.getPairs(client, factoryAddress);
        for (const pair in pairs) {
          if (pairs[pair].contract_addr === address) return "Whitelist pair";
        }
      }

      // Determine if it's add or remove
      return proposal.add_remove_non_voting_members?.add.length ? "Add participants" : "Remove participants";
    case "add_voting_members":
      return "Add voting participants";
    case "punish_members":
      return "Punish voting participant";
    case "edit_trusted_circle":
      return "Edit Trusted Circle";
    case "grant_engagement":
      return "Grant engagement";
    default:
      throw new Error("Error: unhandled proposal type");
  }
}

export class DsoContractQuerier {
  readonly address: string;
  protected readonly client: CosmWasmClient;

  constructor(address: string, client: CosmWasmClient) {
    this.address = address;
    this.client = client;
  }

  async getDso(): Promise<DsoResponse> {
    const query = { trusted_circle: {} };
    const response: DsoResponse = await this.client.queryContractSmart(this.address, query);
    return response;
  }

  async getAllMembers(): Promise<readonly Member[]> {
    const query = { list_members: {} };
    const { members }: MemberListResponse = await this.client.queryContractSmart(this.address, query);
    return members;
  }

  async getVotingMembers(): Promise<readonly Member[]> {
    const query = { list_voting_members: {} };
    const { members }: MemberListResponse = await this.client.queryContractSmart(this.address, query);
    return members;
  }

  async getEscrow(memberAddress: string): Promise<EscrowResponse> {
    const query = { escrow: { addr: memberAddress } };
    const response: EscrowResponse = await this.client.queryContractSmart(this.address, query);
    return response;
  }

  async getProposals(): Promise<readonly ProposalResponse[]> {
    const query = { list_proposals: {} };
    const { proposals }: ProposalListResponse = await this.client.queryContractSmart(this.address, query);
    return proposals;
  }

  async getProposal(proposalId: number): Promise<ProposalResponse> {
    const query = { proposal: { proposal_id: proposalId } };
    const proposalResponse: ProposalResponse = await this.client.queryContractSmart(this.address, query);
    return proposalResponse;
  }

  async getVote(proposalId: number, voter: string): Promise<VoteResponse> {
    const query = { vote: { proposal_id: proposalId, voter } };
    const voteResponse: VoteResponse = await this.client.queryContractSmart(this.address, query);
    return voteResponse;
  }
}

export class DsoContract extends DsoContractQuerier {
  static readonly GAS_CREATE_DSO = 500_000;
  static readonly GAS_DEPOSIT_ESCROW = 200_000;
  static readonly GAS_RETURN_ESCROW = 200_000;
  static readonly GAS_CHECK_PENDING = 500_000;
  static readonly GAS_LEAVE_DSO = 200_000;
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

  static async createDso(
    signingClient: SigningCosmWasmClient,
    codeId: number,
    creatorAddress: string,
    dsoName: string,
    escrowAmount: string,
    votingDuration: string,
    quorum: string,
    threshold: string,
    members: readonly string[],
    allowEndEarly: boolean,
    funds: readonly Coin[],
    gasPrice: GasPrice,
  ): Promise<string> {
    const msg: Record<string, unknown> = {
      name: dsoName,
      escrow_amount: escrowAmount,
      voting_period: parseInt(votingDuration, 10),
      quorum: (parseFloat(quorum) / 100).toString(),
      threshold: (parseFloat(threshold) / 100).toString(),
      initial_members: members,
      allow_end_early: allowEndEarly,
      edit_trusted_circle_disabled: false, // TODO: revisit what makes sense here
    };

    const { contractAddress } = await signingClient.instantiate(
      creatorAddress,
      codeId,
      msg,
      dsoName,
      calculateFee(DsoContract.GAS_CREATE_DSO, gasPrice),
      {
        admin: creatorAddress,
        funds: funds,
      },
    );
    console.log("New contract address:", contractAddress);
    return contractAddress;
  }

  async depositEscrow(senderAddress: string, funds: readonly Coin[]): Promise<string> {
    const msg = { deposit_escrow: {} };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.address,
      msg,
      calculateFee(DsoContract.GAS_DEPOSIT_ESCROW, this.#gasPrice),
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
      calculateFee(DsoContract.GAS_RETURN_ESCROW, this.#gasPrice),
    );
    return transactionHash;
  }

  async checkPending(memberAddress: string): Promise<string> {
    const msg = { check_pending: {} };
    const { transactionHash } = await this.#signingClient.execute(
      memberAddress,
      this.address,
      msg,
      calculateFee(DsoContract.GAS_CHECK_PENDING, this.#gasPrice),
    );
    return transactionHash;
  }

  async leaveDso(memberAddress: string): Promise<string> {
    const msg = { leave_dso: {} };
    const { transactionHash } = await this.#signingClient.execute(
      memberAddress,
      this.address,
      msg,
      calculateFee(DsoContract.GAS_LEAVE_DSO, this.#gasPrice),
    );
    return transactionHash;
  }

  async propose(
    client: CosmWasmClient,
    factoryAddress: string,
    senderAddress: string,
    description: string,
    proposal: ProposalContent,
  ): Promise<string> {
    const msg = {
      propose: {
        title: await getProposalTitle(client, factoryAddress, proposal),
        description,
        proposal,
      },
    };

    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.address,
      msg,
      calculateFee(DsoContract.GAS_PROPOSE, this.#gasPrice),
    );
    return transactionHash;
  }

  async voteProposal(senderAddress: string, proposalId: number, vote: VoteOption): Promise<string> {
    const msg = { vote: { proposal_id: proposalId, vote } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.address,
      msg,
      calculateFee(DsoContract.GAS_VOTE, this.#gasPrice),
    );
    return transactionHash;
  }

  async executeProposal(senderAddress: string, proposalId: number): Promise<string> {
    const msg = { execute: { proposal_id: proposalId } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.address,
      msg,
      calculateFee(DsoContract.GAS_EXECUTE, this.#gasPrice),
    );
    return transactionHash;
  }
}
