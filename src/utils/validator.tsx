import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { QueryClientImpl } from "codec/confio/poe/v1beta1/query";
import { NetworkConfig } from "config/network";

export interface OperatorResponse {
  readonly operator: string;
  readonly pubkey: any;
  readonly metadata: any;
  readonly jailed_until?: any;
}

interface ListValidatorResponse {
  readonly validators: readonly OperatorResponse[];
}

export class ValidatorContractQuerier {
  valAddress?: string;

  constructor(public readonly config: NetworkConfig, public readonly client: CosmWasmClient) {}
  protected async initAddress(): Promise<void> {
    if (this.valAddress) return;

    const tendermintClient = await Tendermint34Client.connect(this.config.rpcUrl);
    const queryClient = new QueryClient(tendermintClient);
    const rpcClient = createProtobufRpcClient(queryClient);
    const queryService = new QueryClientImpl(rpcClient);

    const { address } = await queryService.ContractAddress({ contractType: PoEContractType.VALSET });
    this.valAddress = address;
  }

  async getValidators(startAfter?: string): Promise<readonly OperatorResponse[]> {
    await this.initAddress();
    if (!this.valAddress) throw new Error("no valAddress");
    const query = { list_validators: { start_after: startAfter } };
    const { validators }: ListValidatorResponse = await this.client.queryContractSmart(
      this.valAddress,
      query,
    );
    return validators;
  }

  async getAllValidators(): Promise<readonly OperatorResponse[]> {
    let validators: readonly OperatorResponse[] = [];
    let nextValidators: readonly OperatorResponse[] = [];

    do {
      const lastOperatorAddress = validators[validators.length - 1]?.operator;
      nextValidators = await this.getValidators(lastOperatorAddress);
      validators = [...validators, ...nextValidators];
    } while (nextValidators.length);

    return validators;
  }

  async getActiveValidators(): Promise<Record<string, unknown>[]> {
    await this.initAddress();
    if (!this.valAddress) throw new Error("no valAddress");
    const query = { list_active_validators: {} };
    const { validators }: any = await this.client.queryContractSmart(this.valAddress, query);
    return validators;
  }
  async getSlashingEvents(operator: string): Promise<string[]> {
    await this.initAddress();
    if (!this.valAddress) throw new Error("no valAddress");
    const query = { list_validator_slashing: { operator } };
    const { slashing }: any = await this.client.queryContractSmart(this.valAddress, query);
    return slashing;
  }
}
