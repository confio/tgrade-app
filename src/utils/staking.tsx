import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Decimal } from "@cosmjs/math";
import { calculateFee, Coin, createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { QueryClientImpl } from "codec/confio/poe/v1beta1/query";
import { NetworkConfig } from "config/network";

export interface Config {
  readonly denom: string;
  readonly tokens_per_point: string;
  readonly min_bond: string;
  readonly unbonding_period: number;
  readonly auto_return_limit: number;
}

interface UnbondingPeriodResponse {
  readonly unbonding_period: number;
}

interface TotalPointsResponse {
  readonly points: number;
  readonly denom: string;
}

export interface Member {
  readonly addr: string;
  readonly points: number;
}

export interface MemberListResponse {
  readonly members: readonly Member[];
}

interface MemberResponse {
  readonly points?: number | null;
}

export interface StakedResponse {
  readonly liquid: Coin;
  readonly vesting: Coin;
}

export interface Claim {
  readonly addr: string;
  readonly amount: string;
  readonly vesting_amount?: string;
  readonly release_at: number;
  readonly creation_height: number;
}

export interface ClaimsResponse {
  readonly claims: readonly Claim[];
}

export interface TokensToStake {
  readonly liquid: Coin;
  readonly vesting?: Coin;
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

  async getTotalPoints(): Promise<TotalPointsResponse> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const query = { total_points: {} };
    const totalPoints: TotalPointsResponse = await this.client.queryContractSmart(this.stakingAddress, query);
    return totalPoints;
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

  async getMemberPoints(address: string): Promise<number> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const query = { member: { addr: address } };
    const { points }: MemberResponse = await this.client.queryContractSmart(this.stakingAddress, query);
    return points ?? 0;
  }

  async getVotingPower(address: string): Promise<number> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const { points: totalPoints } = await this.getTotalPoints();
    const currentPoints = await this.getMemberPoints(address);
    const votingPower = (currentPoints / totalPoints) * 100;

    return votingPower;
  }

  async getPotentialVotingPower(address: string, tokensAdd?: Coin, tokensRemove?: Coin): Promise<number> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const { points: currentTotalPoints } = await this.getTotalPoints();
    const currentPoints = await this.getMemberPoints(address);

    const { tokens_per_point } = await this.getConfiguration();
    const tokensPerPointNumber = parseFloat(tokens_per_point);
    const potentialPointsToAdd = tokensAdd
      ? parseFloat(tokensAdd.amount) * (tokensPerPointNumber / 1000000)
      : 0;
    const potentialPointsToRemove = tokensRemove
      ? parseFloat(tokensRemove.amount) * (tokensPerPointNumber / 1000000000000)
      : 0;

    const potentialPoints = currentPoints + potentialPointsToAdd - potentialPointsToRemove;
    const totalPoints = currentTotalPoints + potentialPointsToAdd - potentialPointsToRemove;
    const potentialVotingPower = (potentialPoints / totalPoints) * 100;

    return isNaN(potentialVotingPower) || potentialVotingPower < 0 ? 0 : potentialVotingPower;
  }

  async getStakedTokens(address: string): Promise<StakedResponse> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const query = { staked: { address } };
    try {
      const stakedResponse: StakedResponse = await this.client.queryContractSmart(this.stakingAddress, query);

      return stakedResponse;
    } catch {
      return {
        liquid: { denom: this.config.feeToken, amount: "0" },
        vesting: { denom: this.config.feeToken, amount: "0" },
      };
    }
  }

  async getStakedTokensSum(address: string): Promise<Coin> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    try {
      const { liquid, vesting }: StakedResponse = await this.getStakedTokens(address);

      if (liquid.denom !== vesting.denom && liquid.denom !== this.config.feeToken) {
        throw new Error("Cannot add different coins");
      }

      const feeTokenDecimals = this.config.coinMap?.[this.config.feeToken]?.fractionalDigits ?? 0;
      const decimalLiquid = Decimal.fromUserInput(liquid.amount, feeTokenDecimals);
      const decimalVesting = Decimal.fromUserInput(vesting.amount, feeTokenDecimals);
      const decimalSum = decimalLiquid.plus(decimalVesting);

      return { denom: this.config.feeToken, amount: decimalSum.toString() };
    } catch {
      return { denom: this.config.feeToken, amount: "0" };
    }
  }

  async getClaims(validatorAddress: string, startAfter?: number): Promise<readonly Claim[]> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const query = { claims: { address: validatorAddress, start_after: startAfter } };
    const { claims }: ClaimsResponse = await this.client.queryContractSmart(this.stakingAddress, query);
    return claims;
  }

  async getAllClaims(validatorAddress: string): Promise<readonly Claim[]> {
    let claims: readonly Claim[] = [];
    let nextClaims: readonly Claim[] = [];

    do {
      const lastClaimReleaseAt = claims[claims.length - 1]?.release_at;
      nextClaims = await this.getClaims(validatorAddress, lastClaimReleaseAt);
      claims = [...claims, ...nextClaims];
    } while (nextClaims.length);

    return claims;
  }
}

export class StakingContract extends StakingContractQuerier {
  static readonly GAS_STAKE = 500_000;
  static readonly GAS_UNSTAKE = 500_000;

  constructor(public readonly config: NetworkConfig, public readonly client: SigningCosmWasmClient) {
    super(config, client);
  }

  async stake(address: string, stake: TokensToStake): Promise<string> {
    await this.initAddress();
    if (!this.stakingAddress) throw new Error("stakingAddress was not set");

    const { transactionHash } = await this.client.execute(
      address,
      this.stakingAddress,
      { bond: { vesting_tokens: stake.vesting } },
      calculateFee(StakingContract.GAS_STAKE, this.config.gasPrice),
      undefined,
      [stake.liquid],
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
