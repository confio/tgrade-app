import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { calculateFee, Coin, createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { QueryClientImpl } from "codec/confio/poe/v1beta1/query";
import { NetworkConfig } from "config/network";

import { getTimeFromSeconds } from "./ui";

interface AdminResponse {
  readonly admin: string;
}

interface TotalWeightResponse {
  readonly weight: number;
}

interface Member {
  readonly addr: string;
  readonly weight: number;
}

interface MemberListResponse {
  readonly members: readonly Member[];
}

interface MemberResponse {
  readonly weight?: number | null;
}

interface HooksResponse {
  readonly hooks: readonly string[];
}

interface PreauthResponse {
  readonly preauths: number;
}

interface FundsResponse {
  readonly funds: Coin;
}

interface DelegatedResponse {
  readonly delegated: string;
}

interface HalflifeInfo {
  readonly last_halflife: string;
  readonly halflife: number;
  readonly next_halflife: string;
}

export interface FormattedHalflifeInfo {
  readonly halflifeDuration: string;
  readonly lastHalflifeDate: Date;
  readonly nextHalflifeDate: Date;
}

interface HalflifeResponse {
  readonly halflife_info?: HalflifeInfo | null;
}

const errorEgAddressNotSet = "Engagement contract address not set. Need to run 'await this.initAddress()'";

export class EngagementContractQuerier {
  egAddress?: string;

  constructor(
    readonly config: NetworkConfig,
    readonly contractType: PoEContractType,
    protected readonly client: CosmWasmClient,
  ) {}

  protected async initAddress(): Promise<void> {
    if (this.egAddress) return;

    const tendermintClient = await Tendermint34Client.connect(this.config.rpcUrl);
    const queryClient = new QueryClient(tendermintClient);
    const rpcClient = createProtobufRpcClient(queryClient);
    const queryService = new QueryClientImpl(rpcClient);

    const { address } = await queryService.ContractAddress({ contractType: this.contractType });
    this.egAddress = address;
  }

  async getAdmin(): Promise<string> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const query = { admin: {} };
    const { admin }: AdminResponse = await this.client.queryContractSmart(this.egAddress, query);
    return admin;
  }

  async getTotalEngagementPoints(): Promise<number> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const query = { total_weight: {} };
    const { weight }: TotalWeightResponse = await this.client.queryContractSmart(this.egAddress, query);
    return weight;
  }

  async getEngagementPoints(address: string, atHeight?: number): Promise<number> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const query = { member: { addr: address, at_height: atHeight } };
    const { weight }: MemberResponse = await this.client.queryContractSmart(this.egAddress, query);
    return weight ?? 0;
  }

  async getMembers(startAfter?: string): Promise<readonly Member[]> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const query = { list_members: { start_after: startAfter } };
    const { members }: MemberListResponse = await this.client.queryContractSmart(this.egAddress, query);
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

  async getHooks(): Promise<readonly string[]> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const query = { hooks: {} };
    const { hooks }: HooksResponse = await this.client.queryContractSmart(this.egAddress, query);
    return hooks;
  }

  async getPreauths(): Promise<number> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const query = { preauths: {} };
    const { preauths }: PreauthResponse = await this.client.queryContractSmart(this.egAddress, query);
    return preauths;
  }

  async getWithdrawableFunds(ownerAddress: string): Promise<Coin> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const query = { withdrawable_funds: { owner: ownerAddress } };
    const { funds }: FundsResponse = await this.client.queryContractSmart(this.egAddress, query);
    return funds;
  }

  async getDistributedFunds(): Promise<Coin> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const query = { distributed_funds: {} };
    const { funds }: FundsResponse = await this.client.queryContractSmart(this.egAddress, query);
    return funds;
  }

  async getUndistributedFunds(): Promise<Coin> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const query = { undistributed_funds: {} };
    const { funds }: FundsResponse = await this.client.queryContractSmart(this.egAddress, query);
    return funds;
  }

  async getDelegated(ownerAddress: string): Promise<string> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const query = { delegated: { owner: ownerAddress } };
    const { delegated }: DelegatedResponse = await this.client.queryContractSmart(this.egAddress, query);
    return delegated;
  }

  private async getHalflifeInfo(): Promise<HalflifeInfo | undefined> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const query = { halflife: {} };
    const { halflife_info }: HalflifeResponse = await this.client.queryContractSmart(this.egAddress, query);
    return halflife_info ?? undefined;
  }

  async getFormattedHalflifeInfo(): Promise<FormattedHalflifeInfo | undefined> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const halflifeInfo = await this.getHalflifeInfo();
    if (!halflifeInfo) return undefined;

    return {
      halflifeDuration: getTimeFromSeconds(halflifeInfo.halflife),
      lastHalflifeDate: new Date(parseInt(halflifeInfo.last_halflife, 10) / 1000000),
      nextHalflifeDate: new Date(parseInt(halflifeInfo.next_halflife, 10) / 1000000),
    };
  }
}

export class EngagementContract extends EngagementContractQuerier {
  static readonly GAS_WITHDRAW_FUNDS = 200_000;
  static readonly GAS_DELEGATED_WITHDRAWAL = 200_000;

  readonly #signingClient: SigningCosmWasmClient;

  constructor(config: NetworkConfig, contractType: PoEContractType, signingClient: SigningCosmWasmClient) {
    super(config, contractType, signingClient);
    this.#signingClient = signingClient;
  }

  async withdrawFunds(
    senderAddress: string,
    ownerAddress?: string,
    receiverAddress?: string,
  ): Promise<string> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const msg = { withdraw_funds: { owner: ownerAddress, receiver: receiverAddress } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.egAddress,
      msg,
      calculateFee(EngagementContract.GAS_WITHDRAW_FUNDS, this.config.gasPrice),
    );
    return transactionHash;
  }

  async delegateWithdrawal(senderAddress: string, delegatedAddress: string): Promise<string> {
    await this.initAddress();
    if (!this.egAddress) throw new Error(errorEgAddressNotSet);

    const msg = { delegate_withdrawal: { delegated: delegatedAddress } };
    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.egAddress,
      msg,
      calculateFee(EngagementContract.GAS_DELEGATED_WITHDRAWAL, this.config.gasPrice),
    );
    return transactionHash;
  }
}
