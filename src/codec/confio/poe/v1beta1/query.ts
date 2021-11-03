/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
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

const baseQueryContractAddressRequest: object = { contractType: 0 };

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
    const message = { ...baseQueryContractAddressRequest } as QueryContractAddressRequest;
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
    const message = { ...baseQueryContractAddressRequest } as QueryContractAddressRequest;
    if (object.contractType !== undefined && object.contractType !== null) {
      message.contractType = poEContractTypeFromJSON(object.contractType);
    } else {
      message.contractType = 0;
    }
    return message;
  },

  toJSON(message: QueryContractAddressRequest): unknown {
    const obj: any = {};
    message.contractType !== undefined && (obj.contractType = poEContractTypeToJSON(message.contractType));
    return obj;
  },

  fromPartial(object: DeepPartial<QueryContractAddressRequest>): QueryContractAddressRequest {
    const message = { ...baseQueryContractAddressRequest } as QueryContractAddressRequest;
    message.contractType = object.contractType ?? 0;
    return message;
  },
};

const baseQueryContractAddressResponse: object = { address: "" };

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
    const message = { ...baseQueryContractAddressResponse } as QueryContractAddressResponse;
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
    const message = { ...baseQueryContractAddressResponse } as QueryContractAddressResponse;
    if (object.address !== undefined && object.address !== null) {
      message.address = String(object.address);
    } else {
      message.address = "";
    }
    return message;
  },

  toJSON(message: QueryContractAddressResponse): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryContractAddressResponse>): QueryContractAddressResponse {
    const message = { ...baseQueryContractAddressResponse } as QueryContractAddressResponse;
    message.address = object.address ?? "";
    return message;
  },
};

const baseQueryUnbondingPeriodRequest: object = {};

export const QueryUnbondingPeriodRequest = {
  encode(_: QueryUnbondingPeriodRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryUnbondingPeriodRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryUnbondingPeriodRequest } as QueryUnbondingPeriodRequest;
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
    const message = { ...baseQueryUnbondingPeriodRequest } as QueryUnbondingPeriodRequest;
    return message;
  },

  toJSON(_: QueryUnbondingPeriodRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<QueryUnbondingPeriodRequest>): QueryUnbondingPeriodRequest {
    const message = { ...baseQueryUnbondingPeriodRequest } as QueryUnbondingPeriodRequest;
    return message;
  },
};

const baseQueryUnbondingPeriodResponse: object = {};

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
    const message = { ...baseQueryUnbondingPeriodResponse } as QueryUnbondingPeriodResponse;
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
    const message = { ...baseQueryUnbondingPeriodResponse } as QueryUnbondingPeriodResponse;
    if (object.time !== undefined && object.time !== null) {
      message.time = Duration.fromJSON(object.time);
    } else {
      message.time = undefined;
    }
    return message;
  },

  toJSON(message: QueryUnbondingPeriodResponse): unknown {
    const obj: any = {};
    message.time !== undefined && (obj.time = message.time ? Duration.toJSON(message.time) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryUnbondingPeriodResponse>): QueryUnbondingPeriodResponse {
    const message = { ...baseQueryUnbondingPeriodResponse } as QueryUnbondingPeriodResponse;
    if (object.time !== undefined && object.time !== null) {
      message.time = Duration.fromPartial(object.time);
    } else {
      message.time = undefined;
    }
    return message;
  },
};

const baseQueryValidatorDelegationRequest: object = { validatorAddr: "" };

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
    const message = { ...baseQueryValidatorDelegationRequest } as QueryValidatorDelegationRequest;
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
    const message = { ...baseQueryValidatorDelegationRequest } as QueryValidatorDelegationRequest;
    if (object.validatorAddr !== undefined && object.validatorAddr !== null) {
      message.validatorAddr = String(object.validatorAddr);
    } else {
      message.validatorAddr = "";
    }
    return message;
  },

  toJSON(message: QueryValidatorDelegationRequest): unknown {
    const obj: any = {};
    message.validatorAddr !== undefined && (obj.validatorAddr = message.validatorAddr);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryValidatorDelegationRequest>): QueryValidatorDelegationRequest {
    const message = { ...baseQueryValidatorDelegationRequest } as QueryValidatorDelegationRequest;
    message.validatorAddr = object.validatorAddr ?? "";
    return message;
  },
};

const baseQueryValidatorDelegationResponse: object = {};

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
    const message = { ...baseQueryValidatorDelegationResponse } as QueryValidatorDelegationResponse;
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
    const message = { ...baseQueryValidatorDelegationResponse } as QueryValidatorDelegationResponse;
    if (object.balance !== undefined && object.balance !== null) {
      message.balance = Coin.fromJSON(object.balance);
    } else {
      message.balance = undefined;
    }
    return message;
  },

  toJSON(message: QueryValidatorDelegationResponse): unknown {
    const obj: any = {};
    message.balance !== undefined &&
      (obj.balance = message.balance ? Coin.toJSON(message.balance) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryValidatorDelegationResponse>): QueryValidatorDelegationResponse {
    const message = { ...baseQueryValidatorDelegationResponse } as QueryValidatorDelegationResponse;
    if (object.balance !== undefined && object.balance !== null) {
      message.balance = Coin.fromPartial(object.balance);
    } else {
      message.balance = undefined;
    }
    return message;
  },
};

const baseQueryValidatorUnbondingDelegationsRequest: object = { validatorAddr: "" };

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
    const message = {
      ...baseQueryValidatorUnbondingDelegationsRequest,
    } as QueryValidatorUnbondingDelegationsRequest;
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
    const message = {
      ...baseQueryValidatorUnbondingDelegationsRequest,
    } as QueryValidatorUnbondingDelegationsRequest;
    if (object.validatorAddr !== undefined && object.validatorAddr !== null) {
      message.validatorAddr = String(object.validatorAddr);
    } else {
      message.validatorAddr = "";
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },

  toJSON(message: QueryValidatorUnbondingDelegationsRequest): unknown {
    const obj: any = {};
    message.validatorAddr !== undefined && (obj.validatorAddr = message.validatorAddr);
    message.pagination !== undefined &&
      (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryValidatorUnbondingDelegationsRequest>,
  ): QueryValidatorUnbondingDelegationsRequest {
    const message = {
      ...baseQueryValidatorUnbondingDelegationsRequest,
    } as QueryValidatorUnbondingDelegationsRequest;
    message.validatorAddr = object.validatorAddr ?? "";
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageRequest.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryValidatorUnbondingDelegationsResponse: object = {};

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
    const message = {
      ...baseQueryValidatorUnbondingDelegationsResponse,
    } as QueryValidatorUnbondingDelegationsResponse;
    message.entries = [];
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
    const message = {
      ...baseQueryValidatorUnbondingDelegationsResponse,
    } as QueryValidatorUnbondingDelegationsResponse;
    message.entries = [];
    if (object.entries !== undefined && object.entries !== null) {
      for (const e of object.entries) {
        message.entries.push(UnbondingDelegationEntry.fromJSON(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromJSON(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
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

  fromPartial(
    object: DeepPartial<QueryValidatorUnbondingDelegationsResponse>,
  ): QueryValidatorUnbondingDelegationsResponse {
    const message = {
      ...baseQueryValidatorUnbondingDelegationsResponse,
    } as QueryValidatorUnbondingDelegationsResponse;
    message.entries = [];
    if (object.entries !== undefined && object.entries !== null) {
      for (const e of object.entries) {
        message.entries.push(UnbondingDelegationEntry.fromPartial(e));
      }
    }
    if (object.pagination !== undefined && object.pagination !== null) {
      message.pagination = PageResponse.fromPartial(object.pagination);
    } else {
      message.pagination = undefined;
    }
    return message;
  },
};

const baseQueryValidatorOutstandingRewardRequest: object = { validatorAddress: "" };

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
    const message = {
      ...baseQueryValidatorOutstandingRewardRequest,
    } as QueryValidatorOutstandingRewardRequest;
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
    const message = {
      ...baseQueryValidatorOutstandingRewardRequest,
    } as QueryValidatorOutstandingRewardRequest;
    if (object.validatorAddress !== undefined && object.validatorAddress !== null) {
      message.validatorAddress = String(object.validatorAddress);
    } else {
      message.validatorAddress = "";
    }
    return message;
  },

  toJSON(message: QueryValidatorOutstandingRewardRequest): unknown {
    const obj: any = {};
    message.validatorAddress !== undefined && (obj.validatorAddress = message.validatorAddress);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryValidatorOutstandingRewardRequest>,
  ): QueryValidatorOutstandingRewardRequest {
    const message = {
      ...baseQueryValidatorOutstandingRewardRequest,
    } as QueryValidatorOutstandingRewardRequest;
    message.validatorAddress = object.validatorAddress ?? "";
    return message;
  },
};

const baseQueryValidatorOutstandingRewardResponse: object = {};

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
    const message = {
      ...baseQueryValidatorOutstandingRewardResponse,
    } as QueryValidatorOutstandingRewardResponse;
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
    const message = {
      ...baseQueryValidatorOutstandingRewardResponse,
    } as QueryValidatorOutstandingRewardResponse;
    if (object.reward !== undefined && object.reward !== null) {
      message.reward = DecCoin.fromJSON(object.reward);
    } else {
      message.reward = undefined;
    }
    return message;
  },

  toJSON(message: QueryValidatorOutstandingRewardResponse): unknown {
    const obj: any = {};
    message.reward !== undefined &&
      (obj.reward = message.reward ? DecCoin.toJSON(message.reward) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryValidatorOutstandingRewardResponse>,
  ): QueryValidatorOutstandingRewardResponse {
    const message = {
      ...baseQueryValidatorOutstandingRewardResponse,
    } as QueryValidatorOutstandingRewardResponse;
    if (object.reward !== undefined && object.reward !== null) {
      message.reward = DecCoin.fromPartial(object.reward);
    } else {
      message.reward = undefined;
    }
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

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined | Long;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
