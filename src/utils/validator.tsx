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
}
/* import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { calculateFee, Coin, GasPrice } from "@cosmjs/stargate";
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { QueryClientImpl } from "codec/confio/poe/v1beta1/query";
import { NetworkConfig } from "config/network";
import { DsoContract } from "./dso";

export class ValidatorContractQuerier {
  valAddress?: string;
  readonly address: string;
  protected readonly client: CosmWasmClient;

  constructor(address: string, client: CosmWasmClient) {
    this.address = address;
    this.client = client;
  }
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
}
export class ValidatorContract extends ValidatorContractQuerier {
  static readonly GAS_EXECUTE = 500_000;

  readonly #signingClient: SigningCosmWasmClient;
  readonly #gasPrice: GasPrice;

  constructor(address: string, signingClient: SigningCosmWasmClient, gasPrice: GasPrice) {
    super(address, signingClient);
    this.#signingClient = signingClient;
    this.#gasPrice = gasPrice;
  }

  async propose(
    client: CosmWasmClient,
    factoryAddress: string,
    senderAddress: string,
    description: string,
    proposal: ProposalContent,
  ): Promise<string> {
    const msg = {
      propose: {
        title: await getProposalTitle(client, factoryAddress, proposal),
        description,
        proposal,
      },
    };

    const { transactionHash } = await this.#signingClient.execute(
      senderAddress,
      this.address,
      msg,
      calculateFee(DsoContract.GAS_PROPOSE, this.#gasPrice),
    );
    return transactionHash;
  }

  async slashValidator(validatorAddress: string): Promise<string[]> {
    if (!validatorAddress) throw new Error("no operator");
    const query = { slash: { validatorAddress } };
    const { slash }: any = await this.client.queryContractSmart(validatorAddress, query);
    console.log(slash);
    return slash;
  } */
/*   async jailValidator(operator: string): Promise<string[]> {
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
*/
