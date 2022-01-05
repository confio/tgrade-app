import { CosmWasmTimestamp, Cw3Status, Votes, VotingRules } from "./dso";

/**
 * See https://github.com/confio/tgrade-contracts/blob/v0.5.2/packages/utils/src/time.rs#L29-L30
 */
export type TgExpiration = CosmWasmTimestamp;

/**
 * See https://github.com/confio/tgrade-contracts/blob/v0.5.2/packages/utils/src/jailing.rs#L25-L30
 */
export type JailingDuration = any;

/**
 * See https://github.com/confio/tgrade-contracts/blob/v0.5.2/contracts/tgrade-oc-proposals/src/state.rs#L9-L21
 */
export interface OversightProposal {
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
  readonly proposal: OversightProposal;
  readonly status: Cw3Status;
  readonly expires: TgExpiration;
  readonly rules: VotingRules;
  readonly total_weight: number;
  /// This is a running tally of all votes cast on this proposal so far.
  readonly votes: Votes;
}
