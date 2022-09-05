import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { fromAscii, toAscii } from "@cosmjs/encoding";
import { calculateFee, Coin, createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { QueryClientImpl } from "codec/confio/poe/v1beta1/query";
import { NetworkConfig } from "config/network";

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

export interface VoterDetail {
  readonly addr: string;
  readonly points: number;
}

export interface VoterListResponse {
  readonly voters: readonly VoterDetail[];
}

export type VoteOption = "yes" | "no" | "abstain";

export interface AssignedArbiters {
  readonly case_id: number;
  readonly arbiters: readonly string[];
}

export type ApoolProposal = {
  readonly text?: Record<string, never>;
} & {
  readonly propose_arbiters?: AssignedArbiters;
};

export type Expiration = {
  readonly at_height: number;
} & {
  readonly at_time: string;
} & {
  readonly never: Record<string, unknown>;
};

export type Cw3Status = "pending" | "open" | "rejected" | "passed" | "executed";

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
  readonly proposal: ApoolProposal;
  readonly status: "pending" | "open" | "rejected" | "passed" | "executed";
  readonly expires: number;
  /// This is the threshold that is applied to this proposal. Both the rules of the voting contract,
  /// as well as the total_points of the voting group may have changed since this time. That means
  /// that the generic `Threshold{}` query does not provide valid information for existing proposals.
  readonly rules: VotingRules;
  readonly total_points: number;
  /// This is a running tally of all votes cast on this proposal so far.
  readonly votes: Votes;
}

export interface ProposalListResponse {
  readonly proposals: readonly ProposalResponse[];
}

export interface APoolProposeResponse {
  readonly txHash: string;
  readonly proposalId?: number;
}

export interface VoteInfo {
  readonly voter: string;
  readonly vote: VoteOption;
  readonly proposal_id: number;
  readonly points: number;
}

export interface VoteResponse {
  readonly vote: VoteInfo | null;
}

export interface VoteListResponse {
  readonly votes: readonly VoteInfo[];
}

export type ComplaintState = {
  readonly initiated?: { expiration: Expiration };
} & {
  readonly waiting?: { wait_over: Expiration };
} & { readonly aborted?: Record<string, never> } & { readonly accepted?: Record<string, never> } & {
  readonly processing?: { arbiters: string };
} & { readonly closed?: { summary: string; ipfs_link: string } };

export interface Complaint {
  readonly complaint_id: number;
  readonly title: string;
  readonly description: string;
  readonly plaintiff: string;
  readonly defendant: string;
  readonly state: ComplaintState;
}

export interface ListComplaintsResponse {
  readonly complaints: readonly Complaint[];
}

export function getProposalTitle(proposal: ApoolProposal): string {
  const proposalProp = Object.keys(proposal)[0];

  switch (proposalProp) {
    case "text":
      return "Open Text Proposal";
    case "propose_arbiters":
      return "Propose Arbiters";
    default:
      return "Uknown proposal type";
  }
}

export class ApContractQuerier {
  arbiterPoolAddress?: string;
  arbiterPoolVotingAddress?: string;

  constructor(readonly config: NetworkConfig, protected readonly client: CosmWasmClient) {}

  protected async initAddress(): Promise<void> {
    if (this.arbiterPoolAddress || this.arbiterPoolVotingAddress) return;

    const tendermintClient = await Tendermint34Client.connect(this.config.rpcUrl);
    const queryClient = new QueryClient(tendermintClient);
    const rpcClient = createProtobufRpcClient(queryClient);
    const queryService = new QueryClientImpl(rpcClient);

    const { address: arbiterPoolAddress } = await queryService.ContractAddress({
      contractType: PoEContractType.ARBITER_POOL,
    });
    const { address: arbiterPoolVotingAddress } = await queryService.ContractAddress({
      contractType: PoEContractType.ARBITER_POOL_VOTING,
    });

    this.arbiterPoolAddress = arbiterPoolAddress;
    this.arbiterPoolVotingAddress = arbiterPoolVotingAddress;
  }

  async getDisputeCost(): Promise<Coin> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const rawConfig = await this.client.queryContractRaw(this.arbiterPoolVotingAddress, toAscii("ap_config"));
    const config = rawConfig ? JSON.parse(fromAscii(rawConfig)) : {};
    const disputeCost: Coin = config?.dispute_cost ?? { denom: "utgd", amount: "0" };
    return disputeCost;
  }

  async getVotingRules(): Promise<VotingRules> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const query = { rules: {} };
    const votingRules: VotingRules = await this.client.queryContractSmart(
      this.arbiterPoolVotingAddress,
      query,
    );
    return votingRules;
  }

  async getProposals(startAfter?: number): Promise<readonly ProposalResponse[]> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const query = { list_proposals: { start_after: startAfter } };
    const { proposals }: ProposalListResponse = await this.client.queryContractSmart(
      this.arbiterPoolVotingAddress,
      query,
    );
    return proposals;
  }

  async getAllProposals(): Promise<readonly ProposalResponse[]> {
    let proposals: readonly ProposalResponse[] = [];
    let nextProposals: readonly ProposalResponse[] = [];

    do {
      const lastProposalId = proposals[proposals.length - 1]?.id;
      nextProposals = await this.getProposals(lastProposalId);
      proposals = [...proposals, ...nextProposals];
    } while (nextProposals.length);

    return proposals;
  }

  async getProposal(proposalId: number): Promise<ProposalResponse> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const query = { proposal: { proposal_id: proposalId } };
    const proposalResponse: ProposalResponse = await this.client.queryContractSmart(
      this.arbiterPoolVotingAddress,
      query,
    );
    return proposalResponse;
  }

  async getVotes(proposalId: number, startAfter?: string): Promise<readonly VoteInfo[]> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const query = {
      list_votes: {
        proposal_id: proposalId,
        start_after: startAfter,
      },
    };
    const { votes }: VoteListResponse = await this.client.queryContractSmart(
      this.arbiterPoolVotingAddress,
      query,
    );
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
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const query = { vote: { proposal_id: proposalId, voter } };
    const voteResponse: VoteResponse = await this.client.queryContractSmart(
      this.arbiterPoolVotingAddress,
      query,
    );
    return voteResponse;
  }

  async getVoters(startAfter?: string): Promise<readonly VoterDetail[]> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const query = { list_voters: { start_after: startAfter } };
    const { voters }: VoterListResponse = await this.client.queryContractSmart(
      this.arbiterPoolVotingAddress,
      query,
    );
    return voters;
  }

  async getAllVoters(): Promise<readonly VoterDetail[]> {
    let voters: readonly VoterDetail[] = [];
    let nextVoters: readonly VoterDetail[] = [];

    do {
      const lastVoterAddress = voters[voters.length - 1]?.addr;
      nextVoters = await this.getVoters(lastVoterAddress);
      voters = [...voters, ...nextVoters];
    } while (nextVoters.length);

    return voters;
  }

  async getComplaints(startAfter?: number): Promise<readonly Complaint[]> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const query = { list_complaints: { start_after: startAfter } };
    const { complaints }: ListComplaintsResponse = await this.client.queryContractSmart(
      this.arbiterPoolVotingAddress,
      query,
    );

    const complaintsWithId: readonly Complaint[] = complaints.map((complaint, index) => ({
      ...complaint,
      complaint_id: index,
    }));
    return complaintsWithId;
  }

  async getAllComplaints(): Promise<readonly Complaint[]> {
    let complaints: readonly Complaint[] = [];
    let nextComplaints: readonly Complaint[] = [];

    do {
      const lastComplaintId = complaints.length ? complaints.length - 1 : undefined;
      nextComplaints = await this.getComplaints(lastComplaintId);
      complaints = [...complaints, ...nextComplaints];
    } while (nextComplaints.length);

    return complaints;
  }

  async getComplaint(complaintId: number): Promise<Complaint> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const query = { complaint: { complaint_id: complaintId } };
    const complaint = await this.client.queryContractSmart(this.arbiterPoolVotingAddress, query);
    return { ...complaint, complaint_id: complaintId };
  }
}

export class ApContract extends ApContractQuerier {
  static readonly GAS_PROPOSE = 200_000;
  static readonly GAS_VOTE = 200_000;
  static readonly GAS_EXECUTE = 500_000;
  static readonly GAS_CLOSE = 500_000;
  static readonly GAS_REGISTER_COMPLAINT = 500_000;
  static readonly GAS_ACCEPT_COMPLAINT = 500_000;
  static readonly GAS_WITHDRAW_COMPLAINT = 500_000;
  static readonly GAS_RENDER_DECISION = 500_000;

  readonly #signingClient: SigningCosmWasmClient;

  constructor(config: NetworkConfig, signingClient: SigningCosmWasmClient) {
    super(config, signingClient);
    this.#signingClient = signingClient;
  }

  async propose(
    senderAddress: string,
    description: string,
    proposal: ApoolProposal,
  ): Promise<APoolProposeResponse> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const title = getProposalTitle(proposal);
    const msg = { propose: { title, description, proposal } };

    const result = await this.#signingClient.execute(
      senderAddress,
      this.arbiterPoolVotingAddress,
      msg,
      calculateFee(ApContract.GAS_PROPOSE, this.config.gasPrice),
    );

    const proposalIdAttr = result.logs
      .flatMap((log) => log.events)
      .flatMap((event) => event.attributes)
      .find((attr) => attr.key === "proposal_id");

    const proposalId = proposalIdAttr ? parseInt(proposalIdAttr.value, 10) : undefined;

    return { txHash: result.transactionHash, proposalId };
  }

  async voteProposal(senderAddress: string, proposalId: number, vote: VoteOption): Promise<string> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const msg = { vote: { proposal_id: proposalId, vote } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.arbiterPoolVotingAddress,
      msg,
      calculateFee(ApContract.GAS_VOTE, this.config.gasPrice),
    );
    return transactionHash;
  }

  async executeProposal(senderAddress: string, proposalId: number): Promise<string> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const msg = { execute: { proposal_id: proposalId } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.arbiterPoolVotingAddress,
      msg,
      calculateFee(ApContract.GAS_EXECUTE, this.config.gasPrice),
    );
    return transactionHash;
  }

  async registerComplaint(
    senderAddress: string,
    title: string,
    description: string,
    defendant: string,
  ): Promise<string> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const msg = { register_complaint: { title, description, defendant } };
    const disputeCost = await this.getDisputeCost();
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.arbiterPoolVotingAddress,
      msg,
      calculateFee(ApContract.GAS_REGISTER_COMPLAINT, this.config.gasPrice),
      undefined,
      [disputeCost],
    );
    return transactionHash;

    // TODO return complaintId too, getting it from the logs events
    // return { txHash: result.transactionHash, complaintId };
  }

  async acceptComplaint(senderAddress: string, complaintId: number): Promise<string> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const msg = { accept_complaint: { complaint_id: complaintId } };
    const disputeCost = await this.getDisputeCost();
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.arbiterPoolVotingAddress,
      msg,
      calculateFee(ApContract.GAS_ACCEPT_COMPLAINT, this.config.gasPrice),
      undefined,
      [disputeCost],
    );
    return transactionHash;
  }

  async withdrawComplaint(senderAddress: string, complaintId: number, reason: string): Promise<string> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const msg = { withdraw_complaint: { complaint_id: complaintId, reason } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.arbiterPoolVotingAddress,
      msg,
      calculateFee(ApContract.GAS_WITHDRAW_COMPLAINT, this.config.gasPrice),
    );
    return transactionHash;
  }

  async renderDecision(
    senderAddress: string,
    complaintId: number,
    summary: string,
    ipfsLink: string,
  ): Promise<string> {
    await this.initAddress();
    if (!this.arbiterPoolVotingAddress) throw new Error("arbiterPoolVotingAddress was not set");

    const msg = { render_decision: { complaint_id: complaintId, summary, ipfs_link: ipfsLink } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.arbiterPoolVotingAddress,
      msg,
      calculateFee(ApContract.GAS_RENDER_DECISION, this.config.gasPrice),
    );
    return transactionHash;
  }
}
