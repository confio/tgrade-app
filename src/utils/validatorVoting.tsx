import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { calculateFee, createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
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

interface VoterDetail {
  readonly addr: string;
  readonly weight: number;
}

interface VoterListResponse {
  readonly voters: readonly VoterDetail[];
}

export type VoteOption = "yes" | "no" | "abstain";

export interface RegisterUpgrade {
  readonly name: string;
  readonly height: number;
  readonly info: string;
}

export interface UpdateConsensusBlockParams {
  readonly max_bytes?: number | null;
  readonly max_gas?: number | null;
}

export interface UpdateConsensusEvidenceParams {
  readonly max_age_num_blocks?: number | null;
  readonly max_age_duration?: number | null;
  readonly max_bytes?: number | null;
}

export interface MigrateContract {
  readonly contract: string;
  readonly code_id: number;
  readonly migrate_msg: string;
}

export type ProposalContent = {
  readonly register_upgrade?: RegisterUpgrade;
} & ({
  readonly cancel_upgrade?: Record<string, unknown>;
} & {
  readonly pin_codes?: readonly number[];
} & {
  readonly unpin_codes?: readonly number[];
} & {
  readonly update_consensus_block_params?: UpdateConsensusBlockParams;
} & {
  readonly update_consensus_evidence_params?: UpdateConsensusEvidenceParams;
} & {
  readonly migrate_contract?: MigrateContract;
});

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
  readonly expires: string;
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

export interface VoteInfo {
  readonly voter: string;
  readonly vote: VoteOption;
  readonly proposal_id: number;
  readonly weight: number;
}

export interface VoteResponse {
  readonly vote: VoteInfo | null;
}

export async function getProposalTitle(proposal: ProposalContent): Promise<string> {
  const proposalProp = Object.keys(proposal)[0];

  switch (proposalProp) {
    case "register_upgrade":
      return "Register upgrade";
    case "cancel_upgrade":
      return "Cancel upgrade";
    case "pin_codes":
      return "Pin codes";
    case "unpin_codes":
      return "Unpin codes";
    case "update_consensus_block_params":
      return "Update consensus block parameters";
    case "update_consensus_evidence_params":
      return "Update consensus evidence parameters";
    case "migrate_contract":
      return "Migrate contract";
    default:
      throw new Error("Error: unhandled proposal type");
  }
}

export class ValidatorVotingContractQuerier {
  validatorVotingAddress?: string;

  constructor(readonly config: NetworkConfig, protected readonly client: CosmWasmClient) {}
  protected async initAddress(): Promise<void> {
    if (this.validatorVotingAddress) return;

    const tendermintClient = await Tendermint34Client.connect(this.config.rpcUrl);
    const queryClient = new QueryClient(tendermintClient);
    const rpcClient = createProtobufRpcClient(queryClient);
    const queryService = new QueryClientImpl(rpcClient);

    const { address } = await queryService.ContractAddress({
      contractType: PoEContractType.VALIDATOR_VOTING,
    });
    this.validatorVotingAddress = address;
  }

  async getRules(): Promise<VotingRules> {
    await this.initAddress();
    if (!this.validatorVotingAddress) throw new Error("validatorVotingAddress was not set");

    const query = { rules: {} };
    const rules: VotingRules = await this.client.queryContractSmart(this.validatorVotingAddress, query);
    return rules;
  }

  async getProposals(startAfter?: number): Promise<readonly ProposalResponse[]> {
    await this.initAddress();
    if (!this.validatorVotingAddress) throw new Error("validatorVotingAddress was not set");

    const query = { list_proposals: { start_after: startAfter } };
    const { proposals }: ProposalListResponse = await this.client.queryContractSmart(
      this.validatorVotingAddress,
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
    if (!this.validatorVotingAddress) throw new Error("validatorVotingAddress was not set");

    const query = { proposal: { proposal_id: proposalId } };
    const proposalResponse: ProposalResponse = await this.client.queryContractSmart(
      this.validatorVotingAddress,
      query,
    );
    return proposalResponse;
  }

  async getVote(proposalId: number, voter: string): Promise<VoteResponse> {
    await this.initAddress();
    if (!this.validatorVotingAddress) throw new Error("validatorVotingAddress was not set");

    const query = { vote: { proposal_id: proposalId, voter } };
    const voteResponse: VoteResponse = await this.client.queryContractSmart(
      this.validatorVotingAddress,
      query,
    );
    return voteResponse;
  }

  async getVoters(): Promise<readonly VoterDetail[]> {
    await this.initAddress();
    if (!this.validatorVotingAddress) throw new Error("validatorVotingAddress was not set");

    const query = { list_voters: {} };
    const { voters }: VoterListResponse = await this.client.queryContractSmart(
      this.validatorVotingAddress,
      query,
    );
    return voters;
  }
}

export class ValidatorVotingContract extends ValidatorVotingContractQuerier {
  static readonly GAS_PROPOSE = 200_000;
  static readonly GAS_VOTE = 200_000;
  static readonly GAS_EXECUTE = 500_000;
  static readonly GAS_CLOSE = 500_000;

  readonly #signingClient: SigningCosmWasmClient;

  constructor(config: NetworkConfig, signingClient: SigningCosmWasmClient) {
    super(config, signingClient);
    this.#signingClient = signingClient;
  }

  async propose(senderAddress: string, description: string, proposal: ProposalContent): Promise<string> {
    await this.initAddress();
    if (!this.validatorVotingAddress) throw new Error("validatorVotingAddress was not set");

    const msg = {
      propose: {
        title: await getProposalTitle(proposal),
        description,
        proposal,
      },
    };

    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.validatorVotingAddress,
      msg,
      calculateFee(ValidatorVotingContract.GAS_PROPOSE, this.config.gasPrice),
    );
    return transactionHash;
  }

  async voteProposal(senderAddress: string, proposalId: number, vote: VoteOption): Promise<string> {
    await this.initAddress();
    if (!this.validatorVotingAddress) throw new Error("validatorVotingAddress was not set");

    const msg = { vote: { proposal_id: proposalId, vote } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.validatorVotingAddress,
      msg,
      calculateFee(ValidatorVotingContract.GAS_VOTE, this.config.gasPrice),
    );
    return transactionHash;
  }

  async executeProposal(senderAddress: string, proposalId: number): Promise<string> {
    await this.initAddress();
    if (!this.validatorVotingAddress) throw new Error("validatorVotingAddress was not set");

    const msg = { execute: { proposal_id: proposalId } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.validatorVotingAddress,
      msg,
      calculateFee(ValidatorVotingContract.GAS_EXECUTE, this.config.gasPrice),
    );
    return transactionHash;
  }
}
