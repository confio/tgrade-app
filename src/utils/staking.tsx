import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { calculateFee, Coin, createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { QueryClientImpl } from "codec/confio/poe/v1beta1/query";
import { NetworkConfig } from "config/network";

export interface Config {
  readonly denom: string;
  readonly tokens_per_weight: string;
  readonly min_bond: string;
  readonly unbonding_period: number;
  readonly auto_return_limit: number;
}

interface UnbondingPeriodResponse {
  readonly unbonding_period: number;
}

interface TotalWeightResponse {
  readonly weight: number;
  readonly denom: string;
}

export interface Member {
  readonly addr: string;
  readonly weight: number;
}

export interface MemberListResponse {
  readonly members: readonly Member[];
}

interface MemberResponse {
  readonly weight?: number | null;
}

export interface StakedResponse {
  readonly stake: Coin;
}

export interface Claim {
  readonly addr: string;
  readonly amount: string;
  readonly release_at: number;
  readonly creation_height: number;
}

export interface ClaimsResponse {
  readonly claims: readonly Claim[];
}

export class StakingContractQuerier {
  stakingAddress?: string;

  constructor(readonly config: NetworkConfig, protected readonly client: CosmWasmClient) {}
  protected async initAddress(): Promise<void> {
    if (this.stakingAddress) return;

    const tendermintClient = await Tendermint34Client.connect(this.config.rpcUrl);
    const queryClient = new QueryClient(tendermintClient);
    const rpcClient = createProtobufRpcClient(queryClient);
    const queryService = new QueryClientImpl(rpcClient);

    const { address } = await queryService.ContractAddress({ contractType: PoEContractType.STAKING });
    this.stakingAddress = address;
  }

  async getConfiguration(): Promise<Config> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const query = { configuration: {} };
    const config: Config = await this.client.queryContractSmart(this.stakingAddress, query);
    return config;
  }

  async getUnbondingPeriod(): Promise<number> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const query = { unbonding_period: {} };
    const { unbonding_period }: UnbondingPeriodResponse = await this.client.queryContractSmart(
      this.stakingAddress,
      query,
    );
    return unbonding_period;
  }

  async getTotalWeight(): Promise<TotalWeightResponse> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const query = { total_weight: {} };
    const totalWeight: TotalWeightResponse = await this.client.queryContractSmart(this.stakingAddress, query);
    return totalWeight;
  }

  async getMembers(startAfter?: string): Promise<readonly Member[]> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const query = { list_members: { start_after: startAfter } };
    const { members }: MemberListResponse = await this.client.queryContractSmart(this.stakingAddress, query);
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

  async getMemberWeight(address: string): Promise<number> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const query = { member: { addr: address } };
    const { weight }: MemberResponse = await this.client.queryContractSmart(this.stakingAddress, query);
    return weight ?? 0;
  }

  async getVotingPower(address: string): Promise<number> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const { weight: totalWeight } = await this.getTotalWeight();
    const currentWeight = await this.getMemberWeight(address);
    const votingPower = (currentWeight / totalWeight) * 100;

    return votingPower;
  }

  async getPotentialVotingPower(address: string, tokensAdd?: Coin, tokensRemove?: Coin): Promise<number> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const { weight: currentTotalWeight } = await this.getTotalWeight();
    const currentWeight = await this.getMemberWeight(address);

    const { tokens_per_weight } = await this.getConfiguration();
    const tokensPerWeightNumber = parseFloat(tokens_per_weight);
    const potentialWeightToAdd = tokensAdd ? parseFloat(tokensAdd.amount) * tokensPerWeightNumber : 0;
    const potentialWeightToRemove = tokensRemove
      ? parseFloat(tokensRemove.amount) * tokensPerWeightNumber
      : 0;

    const potentialWeight = currentWeight + potentialWeightToAdd - potentialWeightToRemove;
    const totalWeight = currentTotalWeight + potentialWeightToAdd - potentialWeightToRemove;
    const potentialVotingPower = (potentialWeight / totalWeight) * 100;

    return isNaN(potentialVotingPower) ? 0 : potentialVotingPower;
  }

  async getStakedTokens(address: string): Promise<Coin> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const query = { staked: { address } };
    const { stake }: StakedResponse = await this.client.queryContractSmart(this.stakingAddress, query);
    return stake;
  }
}

export class StakingContract extends StakingContractQuerier {
  static readonly GAS_STAKE = 500_000;
  static readonly GAS_UNSTAKE = 500_000;

  constructor(public readonly config: NetworkConfig, public readonly client: SigningCosmWasmClient) {
    super(config, client);
  }

  async stake(address: string, tokens: Coin): Promise<string> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const { transactionHash } = await this.client.execute(
      address,
      this.stakingAddress,
      { bond: {} },
      calculateFee(StakingContract.GAS_STAKE, this.config.gasPrice),
      undefined,
      [tokens],
    );
    return transactionHash;
  }

  async unstake(address: string, tokens: Coin): Promise<string> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const { transactionHash } = await this.client.execute(
      address,
      this.stakingAddress,
      { unbond: { tokens } },
      calculateFee(StakingContract.GAS_UNSTAKE, this.config.gasPrice),
    );
    return transactionHash;
  }
}
