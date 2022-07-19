/* eslint-disable */
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import {
  PoEContractType,
  poEContractTypeFromJSON,
  poEContractTypeToJSON,
} from "../../../confio/poe/v1beta1/poe";
import { Duration } from "../../../google/protobuf/duration";
import { Coin, DecCoin } from "../../../cosmos/base/v1beta1/coin";
import { PageRequest, PageResponse } from "../../../cosmos/base/query/v1beta1/pagination";
import { UnbondingDelegationEntry } from "../../../cosmos/staking/v1beta1/staking";
import {
  QueryValidatorsResponse,
  QueryValidatorResponse,
  QueryHistoricalInfoResponse,
  QueryValidatorsRequest,
  QueryValidatorRequest,
  QueryHistoricalInfoRequest,
} from "../../../cosmos/staking/v1beta1/query";

export const protobufPackage = "confio.poe.v1beta1";

/**
 * QueryContractAddressRequest is the request type for the Query/ContractAddress
 * RPC method.
 */
export interface QueryContractAddressRequest {
  /** ContractType is the type of contract */
  contractType: PoEContractType;
}

/**
 * QueryContractAddressRequest is the response type for the
 * Query/ContractAddress RPC method.
 */
export interface QueryContractAddressResponse {
  address: string;
}

/**
 * QueryUnbondingPeriodRequest is request type for the Query/UnbondingPeriod RPC
 * method
 */
export interface QueryUnbondingPeriodRequest {}

/**
 * QueryUnbondingPeriodResponse is response type for the Query/UnbondingPeriod
 * RPC method
 */
export interface QueryUnbondingPeriodResponse {
  /** Time is the time that must pass */
  time?: Duration;
}

/**
 * QueryValidatorDelegationRequest is request type for the
 * Query/ValidatorDelegation RPC method
 */
export interface QueryValidatorDelegationRequest {
  /** validator_addr defines the validator address to query for. */
  validatorAddr: string;
}

/**
 * QueryValidatorDelegationResponse is response type for the
 * Query/ValidatorDelegation RPC method
 */
export interface QueryValidatorDelegationResponse {
  balance?: Coin;
}

/**
 * QueryValidatorUnbondingDelegationsRequest is required type for the
 * Query/ValidatorUnbondingDelegations RPC method
 */
export interface QueryValidatorUnbondingDelegationsRequest {
  /** validator_addr defines the validator address to query for. */
  validatorAddr: string;
  /** pagination defines an optional pagination for the request. */
  pagination?: PageRequest;
}

/**
 * QueryValidatorUnbondingDelegationsResponse is response type for the
 * Query/ValidatorUnbondingDelegations RPC method.
 */
export interface QueryValidatorUnbondingDelegationsResponse {
  /** unbonding delegation entries */
  entries: UnbondingDelegationEntry[];
  /** pagination defines the pagination in the response. */
  pagination?: PageResponse;
}

/**
 * QueryValidatorOutstandingRewardRequest is the request type for the
 * Query/ValidatorOutstandingReward RPC method.
 */
export interface QueryValidatorOutstandingRewardRequest {
  /** validator_address defines the validator address to query for. */
  validatorAddress: string;
}

/**
 * QueryValidatorOutstandingRewardResponse is the response type for the
 * Query/ValidatorOutstandingReward RPC method.
 */
export interface QueryValidatorOutstandingRewardResponse {
  reward?: DecCoin;
}

function createBaseQueryContractAddressRequest(): QueryContractAddressRequest {
  return { contractType: 0 };
}

export const QueryContractAddressRequest = {
  encode(message: QueryContractAddressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.contractType !== 0) {
      writer.uint32(8).int32(message.contractType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryContractAddressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryContractAddressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contractType = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryContractAddressRequest {
    return {
      contractType: isSet(object.contractType) ? poEContractTypeFromJSON(object.contractType) : 0,
    };
  },

  toJSON(message: QueryContractAddressRequest): unknown {
    const obj: any = {};
    message.contractType !== undefined && (obj.contractType = poEContractTypeToJSON(message.contractType));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryContractAddressRequest>, I>>(
    object: I,
  ): QueryContractAddressRequest {
    const message = createBaseQueryContractAddressRequest();
    message.contractType = object.contractType ?? 0;
    return message;
  },
};

function createBaseQueryContractAddressResponse(): QueryContractAddressResponse {
  return { address: "" };
}

export const QueryContractAddressResponse = {
  encode(message: QueryContractAddressResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryContractAddressResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryContractAddressResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryContractAddressResponse {
    return {
      address: isSet(object.address) ? String(object.address) : "",
    };
  },

  toJSON(message: QueryContractAddressResponse): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryContractAddressResponse>, I>>(
    object: I,
  ): QueryContractAddressResponse {
    const message = createBaseQueryContractAddressResponse();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseQueryUnbondingPeriodRequest(): QueryUnbondingPeriodRequest {
  return {};
}

export const QueryUnbondingPeriodRequest = {
  encode(_: QueryUnbondingPeriodRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryUnbondingPeriodRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryUnbondingPeriodRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryUnbondingPeriodRequest {
    return {};
  },

  toJSON(_: QueryUnbondingPeriodRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryUnbondingPeriodRequest>, I>>(
    _: I,
  ): QueryUnbondingPeriodRequest {
    const message = createBaseQueryUnbondingPeriodRequest();
    return message;
  },
};

function createBaseQueryUnbondingPeriodResponse(): QueryUnbondingPeriodResponse {
  return { time: undefined };
}

export const QueryUnbondingPeriodResponse = {
  encode(message: QueryUnbondingPeriodResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.time !== undefined) {
      Duration.encode(message.time, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryUnbondingPeriodResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryUnbondingPeriodResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.time = Duration.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryUnbondingPeriodResponse {
    return {
      time: isSet(object.time) ? Duration.fromJSON(object.time) : undefined,
    };
  },

  toJSON(message: QueryUnbondingPeriodResponse): unknown {
    const obj: any = {};
    message.time !== undefined && (obj.time = message.time ? Duration.toJSON(message.time) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryUnbondingPeriodResponse>, I>>(
    object: I,
  ): QueryUnbondingPeriodResponse {
    const message = createBaseQueryUnbondingPeriodResponse();
    message.time =
      object.time !== undefined && object.time !== null ? Duration.fromPartial(object.time) : undefined;
    return message;
  },
};

function createBaseQueryValidatorDelegationRequest(): QueryValidatorDelegationRequest {
  return { validatorAddr: "" };
}

export const QueryValidatorDelegationRequest = {
  encode(message: QueryValidatorDelegationRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.validatorAddr !== "") {
      writer.uint32(10).string(message.validatorAddr);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryValidatorDelegationRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryValidatorDelegationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorAddr = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryValidatorDelegationRequest {
    return {
      validatorAddr: isSet(object.validatorAddr) ? String(object.validatorAddr) : "",
    };
  },

  toJSON(message: QueryValidatorDelegationRequest): unknown {
    const obj: any = {};
    message.validatorAddr !== undefined && (obj.validatorAddr = message.validatorAddr);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryValidatorDelegationRequest>, I>>(
    object: I,
  ): QueryValidatorDelegationRequest {
    const message = createBaseQueryValidatorDelegationRequest();
    message.validatorAddr = object.validatorAddr ?? "";
    return message;
  },
};

function createBaseQueryValidatorDelegationResponse(): QueryValidatorDelegationResponse {
  return { balance: undefined };
}

export const QueryValidatorDelegationResponse = {
  encode(message: QueryValidatorDelegationResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.balance !== undefined) {
      Coin.encode(message.balance, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryValidatorDelegationResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryValidatorDelegationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.balance = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryValidatorDelegationResponse {
    return {
      balance: isSet(object.balance) ? Coin.fromJSON(object.balance) : undefined,
    };
  },

  toJSON(message: QueryValidatorDelegationResponse): unknown {
    const obj: any = {};
    message.balance !== undefined &&
      (obj.balance = message.balance ? Coin.toJSON(message.balance) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryValidatorDelegationResponse>, I>>(
    object: I,
  ): QueryValidatorDelegationResponse {
    const message = createBaseQueryValidatorDelegationResponse();
    message.balance =
      object.balance !== undefined && object.balance !== null ? Coin.fromPartial(object.balance) : undefined;
    return message;
  },
};

function createBaseQueryValidatorUnbondingDelegationsRequest(): QueryValidatorUnbondingDelegationsRequest {
  return { validatorAddr: "", pagination: undefined };
}

export const QueryValidatorUnbondingDelegationsRequest = {
  encode(
    message: QueryValidatorUnbondingDelegationsRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.validatorAddr !== "") {
      writer.uint32(10).string(message.validatorAddr);
    }
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryValidatorUnbondingDelegationsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryValidatorUnbondingDelegationsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorAddr = reader.string();
          break;
        case 2:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryValidatorUnbondingDelegationsRequest {
    return {
      validatorAddr: isSet(object.validatorAddr) ? String(object.validatorAddr) : "",
      pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryValidatorUnbondingDelegationsRequest): unknown {
    const obj: any = {};
    message.validatorAddr !== undefined && (obj.validatorAddr = message.validatorAddr);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryValidatorUnbondingDelegationsRequest>, I>>(
    object: I,
  ): QueryValidatorUnbondingDelegationsRequest {
    const message = createBaseQueryValidatorUnbondingDelegationsRequest();
    message.validatorAddr = object.validatorAddr ?? "";
    message.pagination =
      object.pagination !== undefined && object.pagination !== null
        ? PageRequest.fromPartial(object.pagination)
        : undefined;
    return message;
  },
};

function createBaseQueryValidatorUnbondingDelegationsResponse(): QueryValidatorUnbondingDelegationsResponse {
  return { entries: [], pagination: undefined };
}

export const QueryValidatorUnbondingDelegationsResponse = {
  encode(
    message: QueryValidatorUnbondingDelegationsResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.entries) {
      UnbondingDelegationEntry.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryValidatorUnbondingDelegationsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryValidatorUnbondingDelegationsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.entries.push(UnbondingDelegationEntry.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryValidatorUnbondingDelegationsResponse {
    return {
      entries: Array.isArray(object?.entries)
        ? object.entries.map((e: any) => UnbondingDelegationEntry.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryValidatorUnbondingDelegationsResponse): unknown {
    const obj: any = {};
    if (message.entries) {
      obj.entries = message.entries.map((e) => (e ? UnbondingDelegationEntry.toJSON(e) : undefined));
    } else {
      obj.entries = [];
    }
    message.pagination !== undefined &&
      (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryValidatorUnbondingDelegationsResponse>, I>>(
    object: I,
  ): QueryValidatorUnbondingDelegationsResponse {
    const message = createBaseQueryValidatorUnbondingDelegationsResponse();
    message.entries = object.entries?.map((e) => UnbondingDelegationEntry.fromPartial(e)) || [];
    message.pagination =
      object.pagination !== undefined && object.pagination !== null
        ? PageResponse.fromPartial(object.pagination)
        : undefined;
    return message;
  },
};

function createBaseQueryValidatorOutstandingRewardRequest(): QueryValidatorOutstandingRewardRequest {
  return { validatorAddress: "" };
}

export const QueryValidatorOutstandingRewardRequest = {
  encode(
    message: QueryValidatorOutstandingRewardRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.validatorAddress !== "") {
      writer.uint32(10).string(message.validatorAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryValidatorOutstandingRewardRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryValidatorOutstandingRewardRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryValidatorOutstandingRewardRequest {
    return {
      validatorAddress: isSet(object.validatorAddress) ? String(object.validatorAddress) : "",
    };
  },

  toJSON(message: QueryValidatorOutstandingRewardRequest): unknown {
    const obj: any = {};
    message.validatorAddress !== undefined && (obj.validatorAddress = message.validatorAddress);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryValidatorOutstandingRewardRequest>, I>>(
    object: I,
  ): QueryValidatorOutstandingRewardRequest {
    const message = createBaseQueryValidatorOutstandingRewardRequest();
    message.validatorAddress = object.validatorAddress ?? "";
    return message;
  },
};

function createBaseQueryValidatorOutstandingRewardResponse(): QueryValidatorOutstandingRewardResponse {
  return { reward: undefined };
}

export const QueryValidatorOutstandingRewardResponse = {
  encode(
    message: QueryValidatorOutstandingRewardResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.reward !== undefined) {
      DecCoin.encode(message.reward, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryValidatorOutstandingRewardResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryValidatorOutstandingRewardResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.reward = DecCoin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryValidatorOutstandingRewardResponse {
    return {
      reward: isSet(object.reward) ? DecCoin.fromJSON(object.reward) : undefined,
    };
  },

  toJSON(message: QueryValidatorOutstandingRewardResponse): unknown {
    const obj: any = {};
    message.reward !== undefined &&
      (obj.reward = message.reward ? DecCoin.toJSON(message.reward) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryValidatorOutstandingRewardResponse>, I>>(
    object: I,
  ): QueryValidatorOutstandingRewardResponse {
    const message = createBaseQueryValidatorOutstandingRewardResponse();
    message.reward =
      object.reward !== undefined && object.reward !== null ? DecCoin.fromPartial(object.reward) : undefined;
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** ContractAddress queries the address for one of the PoE contracts */
  ContractAddress(request: QueryContractAddressRequest): Promise<QueryContractAddressResponse>;
  /** Validators queries all validators that match the given status. */
  Validators(request: QueryValidatorsRequest): Promise<QueryValidatorsResponse>;
  /** Validator queries validator info for given validator address. */
  Validator(request: QueryValidatorRequest): Promise<QueryValidatorResponse>;
  /** Validator queries validator info for given validator address. */
  UnbondingPeriod(request: QueryUnbondingPeriodRequest): Promise<QueryUnbondingPeriodResponse>;
  /** ValidatorDelegation queries self delegated amount for given validator. */
  ValidatorDelegation(request: QueryValidatorDelegationRequest): Promise<QueryValidatorDelegationResponse>;
  /** ValidatorUnbondingDelegations queries unbonding delegations of a validator. */
  ValidatorUnbondingDelegations(
    request: QueryValidatorUnbondingDelegationsRequest,
  ): Promise<QueryValidatorUnbondingDelegationsResponse>;
  /** HistoricalInfo queries the historical info for given height. */
  HistoricalInfo(request: QueryHistoricalInfoRequest): Promise<QueryHistoricalInfoResponse>;
  /** ValidatorOutstandingRewards queries rewards of a validator address. */
  ValidatorOutstandingReward(
    request: QueryValidatorOutstandingRewardRequest,
  ): Promise<QueryValidatorOutstandingRewardResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.ContractAddress = this.ContractAddress.bind(this);
    this.Validators = this.Validators.bind(this);
    this.Validator = this.Validator.bind(this);
    this.UnbondingPeriod = this.UnbondingPeriod.bind(this);
    this.ValidatorDelegation = this.ValidatorDelegation.bind(this);
    this.ValidatorUnbondingDelegations = this.ValidatorUnbondingDelegations.bind(this);
    this.HistoricalInfo = this.HistoricalInfo.bind(this);
    this.ValidatorOutstandingReward = this.ValidatorOutstandingReward.bind(this);
  }
  ContractAddress(request: QueryContractAddressRequest): Promise<QueryContractAddressResponse> {
    const data = QueryContractAddressRequest.encode(request).finish();
    const promise = this.rpc.request("confio.poe.v1beta1.Query", "ContractAddress", data);
    return promise.then((data) => QueryContractAddressResponse.decode(new _m0.Reader(data)));
  }

  Validators(request: QueryValidatorsRequest): Promise<QueryValidatorsResponse> {
    const data = QueryValidatorsRequest.encode(request).finish();
    const promise = this.rpc.request("confio.poe.v1beta1.Query", "Validators", data);
    return promise.then((data) => QueryValidatorsResponse.decode(new _m0.Reader(data)));
  }

  Validator(request: QueryValidatorRequest): Promise<QueryValidatorResponse> {
    const data = QueryValidatorRequest.encode(request).finish();
    const promise = this.rpc.request("confio.poe.v1beta1.Query", "Validator", data);
    return promise.then((data) => QueryValidatorResponse.decode(new _m0.Reader(data)));
  }

  UnbondingPeriod(request: QueryUnbondingPeriodRequest): Promise<QueryUnbondingPeriodResponse> {
    const data = QueryUnbondingPeriodRequest.encode(request).finish();
    const promise = this.rpc.request("confio.poe.v1beta1.Query", "UnbondingPeriod", data);
    return promise.then((data) => QueryUnbondingPeriodResponse.decode(new _m0.Reader(data)));
  }

  ValidatorDelegation(request: QueryValidatorDelegationRequest): Promise<QueryValidatorDelegationResponse> {
    const data = QueryValidatorDelegationRequest.encode(request).finish();
    const promise = this.rpc.request("confio.poe.v1beta1.Query", "ValidatorDelegation", data);
    return promise.then((data) => QueryValidatorDelegationResponse.decode(new _m0.Reader(data)));
  }

  ValidatorUnbondingDelegations(
    request: QueryValidatorUnbondingDelegationsRequest,
  ): Promise<QueryValidatorUnbondingDelegationsResponse> {
    const data = QueryValidatorUnbondingDelegationsRequest.encode(request).finish();
    const promise = this.rpc.request("confio.poe.v1beta1.Query", "ValidatorUnbondingDelegations", data);
    return promise.then((data) => QueryValidatorUnbondingDelegationsResponse.decode(new _m0.Reader(data)));
  }

  HistoricalInfo(request: QueryHistoricalInfoRequest): Promise<QueryHistoricalInfoResponse> {
    const data = QueryHistoricalInfoRequest.encode(request).finish();
    const promise = this.rpc.request("confio.poe.v1beta1.Query", "HistoricalInfo", data);
    return promise.then((data) => QueryHistoricalInfoResponse.decode(new _m0.Reader(data)));
  }

  ValidatorOutstandingReward(
    request: QueryValidatorOutstandingRewardRequest,
  ): Promise<QueryValidatorOutstandingRewardResponse> {
    const data = QueryValidatorOutstandingRewardRequest.encode(request).finish();
    const promise = this.rpc.request("confio.poe.v1beta1.Query", "ValidatorOutstandingReward", data);
    return promise.then((data) => QueryValidatorOutstandingRewardResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<Exclude<keyof I, KeysOfUnion<P>>, never>;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
