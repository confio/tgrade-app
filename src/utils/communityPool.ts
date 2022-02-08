import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
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
  readonly weight: number;
}

export interface VoterListResponse {
  readonly voters: readonly VoterDetail[];
}

export type VoteOption = "yes" | "no" | "abstain";

export interface SendProposal {
  readonly to_addr: string;
  readonly amount: Coin;
}

export interface ProposalContent {
  readonly send_proposal: SendProposal;
}

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
  readonly proposal: ProposalContent;
  readonly status: "pending" | "open" | "rejected" | "passed" | "executed";
  readonly expires: Expiration;
  /// This is the threshold that is applied to this proposal. Both the rules of the voting contract,
  /// as well as the total_weight of the voting group may have changed since this time. That means
  /// that the generic `Threshold{}` query does not provide valid information for existing proposals.
  readonly rules: VotingRules;
  readonly total_weight: number;
  /// This is a running tally of all votes cast on this proposal so far.
  readonly votes: Votes;
}

export interface ProposalListResponse {
  readonly proposals: readonly ProposalResponse[];
}

export interface CPoolProposeResponse {
  readonly txHash: string;
  readonly proposalId?: number;
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

export interface VoteListResponse {
  readonly votes: readonly VoteInfo[];
}

export class CommunityPoolContractQuerier {
  communityPoolAddress?: string;

  constructor(readonly config: NetworkConfig, protected readonly client: CosmWasmClient) {}
  protected async initAddress(): Promise<void> {
    if (this.communityPoolAddress) return;

    const tendermintClient = await Tendermint34Client.connect(this.config.rpcUrl);
    const queryClient = new QueryClient(tendermintClient);
    const rpcClient = createProtobufRpcClient(queryClient);
    const queryService = new QueryClientImpl(rpcClient);

    const { address } = await queryService.ContractAddress({
      contractType: PoEContractType.COMMUNITY_POOL,
    });
    this.communityPoolAddress = address;
  }

  async getRules(): Promise<VotingRules> {
    await this.initAddress();
    if (!this.communityPoolAddress) throw new Error("communityPoolAddress was not set");

    const query = { rules: {} };
    const rules: VotingRules = await this.client.queryContractSmart(this.communityPoolAddress, query);
    return rules;
  }

  async getProposals(startAfter?: number): Promise<readonly ProposalResponse[]> {
    await this.initAddress();
    if (!this.communityPoolAddress) throw new Error("communityPoolAddress was not set");

    const query = { list_proposals: { start_after: startAfter } };
    const { proposals }: ProposalListResponse = await this.client.queryContractSmart(
      this.communityPoolAddress,
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
    if (!this.communityPoolAddress) throw new Error("communityPoolAddress was not set");

    const query = { proposal: { proposal_id: proposalId } };
    const proposalResponse: ProposalResponse = await this.client.queryContractSmart(
      this.communityPoolAddress,
      query,
    );
    return proposalResponse;
  }

  async getVotes(proposalId: number, startAfter?: string): Promise<readonly VoteInfo[]> {
    await this.initAddress();
    if (!this.communityPoolAddress) throw new Error("communityPoolAddress was not set");

    const query = {
      list_votes: {
        proposal_id: proposalId,
        start_after: startAfter,
      },
    };
    const { votes }: VoteListResponse = await this.client.queryContractSmart(
      this.communityPoolAddress,
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
    if (!this.communityPoolAddress) throw new Error("communityPoolAddress was not set");

    const query = { vote: { proposal_id: proposalId, voter } };
    const voteResponse: VoteResponse = await this.client.queryContractSmart(this.communityPoolAddress, query);
    return voteResponse;
  }

  async getVoters(startAfter?: string): Promise<readonly VoterDetail[]> {
    await this.initAddress();
    if (!this.communityPoolAddress) throw new Error("communityPoolAddress was not set");

    const query = { list_voters: { start_after: startAfter } };
    const { voters }: VoterListResponse = await this.client.queryContractSmart(
      this.communityPoolAddress,
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
}

export class CommunityPoolContract extends CommunityPoolContractQuerier {
  static readonly GAS_PROPOSE = 200_000;
  static readonly GAS_VOTE = 200_000;
  static readonly GAS_EXECUTE = 500_000;
  static readonly GAS_CLOSE = 500_000;

  readonly #signingClient: SigningCosmWasmClient;

  constructor(config: NetworkConfig, signingClient: SigningCosmWasmClient) {
    super(config, signingClient);
    this.#signingClient = signingClient;
  }

  async proposeSend(
    senderAddress: string,
    description: string,
    sendProposal: SendProposal,
  ): Promise<CPoolProposeResponse> {
    await this.initAddress();
    if (!this.communityPoolAddress) throw new Error("communityPoolAddress was not set");

    const msg = {
      propose: {
        title: `Send tokens`,
        description,
        proposal: { send_proposal: sendProposal },
      },
    };

    const result = await this.#signingClient.execute(
      senderAddress,
      this.communityPoolAddress,
      msg,
      calculateFee(CommunityPoolContract.GAS_PROPOSE, this.config.gasPrice),
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
    if (!this.communityPoolAddress) throw new Error("communityPoolAddress was not set");

    const msg = { vote: { proposal_id: proposalId, vote } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.communityPoolAddress,
      msg,
      calculateFee(CommunityPoolContract.GAS_VOTE, this.config.gasPrice),
    );
    return transactionHash;
  }

  async executeProposal(senderAddress: string, proposalId: number): Promise<string> {
    await this.initAddress();
    if (!this.communityPoolAddress) throw new Error("communityPoolAddress was not set");

    const msg = { execute: { proposal_id: proposalId } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.communityPoolAddress,
      msg,
      calculateFee(CommunityPoolContract.GAS_EXECUTE, this.config.gasPrice),
    );
    return transactionHash;
  }
}
