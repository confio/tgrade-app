import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { QueryClientImpl } from "codec/confio/poe/v1beta1/query";
import { NetworkConfig } from "config/network";

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

  async getValidators(): Promise<Record<string, unknown>[]> {
    await this.initAddress();
    if (!this.valAddress) throw new Error("no valAddress");
    const query = { list_validators: {} };
    const { validators }: any = await this.client.queryContractSmart(this.valAddress, query);
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

  async slashValidator(validatorAddress: string): Promise<string[]> {
    if (!validatorAddress) throw new Error("no operator");
    const query = { slash: { validatorAddress } };
    const { slashing }: any = await this.client.queryContractSmart(validatorAddress, query);
    console.log(slashing);
    return slashing;
  }
  async jailValidator(operator: string): Promise<string[]> {
    await this.initAddress();
    if (!this.valAddress) throw new Error("no valAddress");
    const query = { list_validator_slashing: { operator } };
    const { slashing }: any = await this.client.queryContractSmart(this.valAddress, query);
    return slashing;
  }
  async unjailValidator(operator: string): Promise<string[]> {
    await this.initAddress();
    if (!this.valAddress) throw new Error("no valAddress");
    const query = { list_validator_slashing: { operator } };
    const { slashing }: any = await this.client.queryContractSmart(this.valAddress, query);
    return slashing;
  }
}
