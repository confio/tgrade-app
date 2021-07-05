import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin } from "@cosmjs/stargate";

export type VoteOption = "yes" | "no" | "abstain";

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
  readonly rules: VotingRules;
}

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
  readonly edit_dso?: {
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
};

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
  readonly votes: Votes;
}

export interface ProposalListResponse {
  readonly proposals: readonly ProposalResponse[];
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

function getProposalTitle(proposal: ProposalContent): string {
  const proposalProp = Object.keys(proposal)[0];

  switch (proposalProp) {
    case "add_remove_non_voting_members":
      return proposal.add_remove_non_voting_members?.add.length ? "Add participants" : "Remove participants";
    case "add_voting_members":
      return "Add voting participants";
    case "edit_dso":
      return "Edit Trusted Circle";
    default:
      throw new Error("Error: unhandled proposal type");
  }
}

export interface DsoInstance {
  readonly dsoAddress: string;

  // queries
  dso: () => Promise<DsoResponse>;
  listAllMembers: () => Promise<readonly Member[]>;
  listVotingMembers: () => Promise<readonly Member[]>;
  escrow: (memberAddress: string) => Promise<EscrowResponse>;
  listProposals: () => Promise<readonly ProposalResponse[]>;
  proposal: (proposalId: number) => Promise<ProposalResponse>;

  // actions
  depositEscrow: (senderAddress: string, funds: readonly Coin[]) => Promise<string>;
  leaveDso: (memberAddress: string) => Promise<string>;
  propose: (senderAddress: string, description: string, proposal: ProposalContent) => Promise<string>;
  voteProposal: (senderAddress: string, proposalId: number, vote: VoteOption) => Promise<string>;
  executeProposal: (senderAddress: string, proposalId: number) => Promise<string>;
}

export interface DsoContractUse {
  use: (dsoAddress: string) => DsoInstance;
  createDso: (
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
  ) => Promise<string>;
}

export const DsoContract = (client: SigningCosmWasmClient): DsoContractUse => {
  const use = (dsoAddress: string): DsoInstance => {
    const dso = async (): Promise<DsoResponse> => {
      const query = { dso: {} };
      const response: DsoResponse = await client.queryContractSmart(dsoAddress, query);
      return response;
    };
    const listAllMembers = async (): Promise<readonly Member[]> => {
      const query = { list_members: {} };
      const { members }: MemberListResponse = await client.queryContractSmart(dsoAddress, query);
      return members;
    };
    const listVotingMembers = async (): Promise<readonly Member[]> => {
      const query = { list_voting_members: {} };
      const { members }: MemberListResponse = await client.queryContractSmart(dsoAddress, query);
      return members;
    };
    const escrow = async (memberAddress: string): Promise<EscrowResponse> => {
      const query = { escrow: { addr: memberAddress } };
      const response: EscrowResponse = await client.queryContractSmart(dsoAddress, query);
      return response;
    };
    const listProposals = async (): Promise<readonly ProposalResponse[]> => {
      const query = { list_proposals: {} };
      const { proposals }: ProposalListResponse = await client.queryContractSmart(dsoAddress, query);
      return proposals;
    };
    const proposal = async (proposalId: number): Promise<ProposalResponse> => {
      const query = { proposal: { proposal_id: proposalId } };
      const proposalResponse = await client.queryContractSmart(dsoAddress, query);
      return proposalResponse;
    };

    const depositEscrow = async (senderAddress: string, funds: readonly Coin[]): Promise<string> => {
      const query = { deposit_escrow: {} };
      const { transactionHash } = await client.execute(senderAddress, dsoAddress, query, undefined, funds);
      return transactionHash;
    };
    const leaveDso = async (memberAddress: string): Promise<string> => {
      const query = { leave_dso: {} };
      const { transactionHash } = await client.execute(memberAddress, dsoAddress, query);
      return transactionHash;
    };
    const propose = async (
      senderAddress: string,
      description: string,
      proposal: ProposalContent,
    ): Promise<string> => {
      const query = {
        propose: {
          title: getProposalTitle(proposal),
          description,
          proposal,
        },
      };

      const { transactionHash } = await client.execute(senderAddress, dsoAddress, query);
      return transactionHash;
    };
    const voteProposal = async (
      senderAddress: string,
      proposalId: number,
      vote: VoteOption,
    ): Promise<string> => {
      const query = { vote: { proposal_id: proposalId, vote } };
      const { transactionHash } = await client.execute(senderAddress, dsoAddress, query);
      return transactionHash;
    };
    const executeProposal = async (senderAddress: string, proposalId: number): Promise<string> => {
      const query = { execute: { proposal_id: proposalId } };
      const { transactionHash } = await client.execute(senderAddress, dsoAddress, query);
      return transactionHash;
    };

    return {
      dsoAddress,
      dso,
      listAllMembers,
      listVotingMembers,
      escrow,
      listProposals,
      proposal,
      depositEscrow,
      leaveDso,
      propose,
      voteProposal,
      executeProposal,
    };
  };

  const createDso = async (
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
  ): Promise<string> => {
    const initMsg: Record<string, unknown> = {
      admin: creatorAddress,
      name: dsoName,
      escrow_amount: escrowAmount,
      voting_period: parseInt(votingDuration, 10),
      quorum: (parseFloat(quorum) / 100).toString(),
      threshold: (parseFloat(threshold) / 100).toString(),
      initial_members: members,
      allow_end_early: allowEndEarly,
    };

    const { contractAddress } = await client.instantiate(creatorAddress, codeId, initMsg, dsoName, {
      admin: creatorAddress,
      transferAmount: funds,
    });
    return contractAddress;
  };
  return { use, createDso };
};
