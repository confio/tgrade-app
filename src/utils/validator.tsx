import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { calculateFee, createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { QueryClientImpl } from "codec/confio/poe/v1beta1/query";
import { NetworkConfig } from "config/network";
import { useEffect, useState } from "react";

export interface ValidatorMetadata {
  /// The validator's name (required)
  readonly moniker: string;
  /// The optional identity signature (ex. UPort or Keybase)
  readonly identity?: string;
  /// The validator's (optional) website
  readonly website?: string;
  /// The validator's (optional) security contact email
  readonly security_contact?: string;
  /// The validator's (optional) details
  readonly details?: string;
}

export interface OperatorResponse {
  readonly operator: string;
  readonly pubkey: any;
  readonly metadata: ValidatorMetadata;
  readonly jailed_until?: any;
}

interface ValidatorResponse {
  /// This is unset if no validator registered
  readonly validator?: OperatorResponse | null;
}

interface ListValidatorResponse {
  readonly validators: readonly OperatorResponse[];
}

export interface ValidatorSlashing {
  readonly slash_height: number;
  readonly portion: string;
}

interface ListValidatorSlashingResponse {
  /// Operator address
  readonly addr: string;
  /// Block height of first validator addition to validators set
  readonly start_height: number;
  /// Slashing events, if any
  readonly slashing: readonly ValidatorSlashing[];
  /// Whether or not a validator has been tombstoned (killed out of
  /// validator set)
  readonly tombstoned: boolean;
  /// If validator is jailed, it will show expiration time
  readonly jailed_until: any;
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

  async getValidator(operatorAddress: string): Promise<OperatorResponse | undefined> {
    await this.initAddress();
    if (!this.valAddress) throw new Error("no valAddress");
    const query = { validator: { operator: operatorAddress } };
    const { validator }: ValidatorResponse = await this.client.queryContractSmart(this.valAddress, query);

    return validator ?? undefined;
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

  async getSlashingEvents(operator: string): Promise<readonly ValidatorSlashing[]> {
    await this.initAddress();
    if (!this.valAddress) throw new Error("no valAddress");
    const query = { list_validator_slashing: { operator } };
    const { slashing }: ListValidatorSlashingResponse = await this.client.queryContractSmart(
      this.valAddress,
      query,
    );
    return slashing;
  }
}

export class ValidatorContract extends ValidatorContractQuerier {
  static readonly GAS_UNJAIL = 500_000;

  readonly #signingClient: SigningCosmWasmClient;

  constructor(config: NetworkConfig, signingClient: SigningCosmWasmClient) {
    super(config, signingClient);
    this.#signingClient = signingClient;
  }

  async unjailSelf(validatorAddress: string): Promise<string> {
    await this.initAddress();
    if (!this.valAddress) throw new Error("no valAddress");

    const msg = { unjail: {} };
    const { transactionHash } = await this.#signingClient.execute(
      validatorAddress,
      this.valAddress,
      msg,
      calculateFee(ValidatorContract.GAS_UNJAIL, this.config.gasPrice),
    );

    return transactionHash;
  }
}

interface ValidatorsLoader {
  readonly status: "idle" | "loadingFirstPage" | "loadingRestPages" | "done";
  readonly validators: readonly OperatorResponse[];
}

export function useLoadValidatorsBg(config: NetworkConfig, client?: CosmWasmClient): ValidatorsLoader {
  const [status, setStatus] = useState<ValidatorsLoader["status"]>("idle");
  const [validators, setValidators] = useState<ValidatorsLoader["validators"]>([]);

  const lastOperatorAddress: string | undefined = validators[validators.length - 1]?.operator;

  useEffect(() => {
    (async function () {
      if (!client || status === "done") return;
      const valContract = new ValidatorContractQuerier(config, client);

      if (status === "idle") {
        setStatus("loadingFirstPage");
        const validators = await valContract.getValidators();
        setValidators(validators);
        setStatus("loadingRestPages");
        return;
      }

      if (status === "loadingRestPages") {
        const nextValidators = await valContract.getValidators(lastOperatorAddress);

        if (nextValidators.length) {
          setValidators((validators) => [...validators, ...nextValidators]);
        } else {
          setStatus("done");
        }
      }
    })();
  }, [client, config, lastOperatorAddress, status]);

  return { status, validators };
}
