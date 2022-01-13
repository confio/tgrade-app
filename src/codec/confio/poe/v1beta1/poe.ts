/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../../cosmos/base/v1beta1/coin";

export const protobufPackage = "confio.poe.v1beta1";

/** PoEContractType type of PoE contract */
export enum PoEContractType {
  UNDEFINED = 0,
  STAKING = 1,
  VALSET = 2,
  ENGAGEMENT = 3,
  MIXER = 4,
  DISTRIBUTION = 5,
  OVERSIGHT_COMMUNITY = 6,
  OVERSIGHT_COMMUNITY_PROPOSALS = 7,
  COMMUNITY_POOL = 8,
  VALIDATOR_VOTING = 9,
  UNRECOGNIZED = -1,
}

export function poEContractTypeFromJSON(object: any): PoEContractType {
  switch (object) {
    case 0:
    case "UNDEFINED":
      return PoEContractType.UNDEFINED;
    case 1:
    case "STAKING":
      return PoEContractType.STAKING;
    case 2:
    case "VALSET":
      return PoEContractType.VALSET;
    case 3:
    case "ENGAGEMENT":
      return PoEContractType.ENGAGEMENT;
    case 4:
    case "MIXER":
      return PoEContractType.MIXER;
    case 5:
    case "DISTRIBUTION":
      return PoEContractType.DISTRIBUTION;
    case 6:
    case "OVERSIGHT_COMMUNITY":
      return PoEContractType.OVERSIGHT_COMMUNITY;
    case 7:
    case "OVERSIGHT_COMMUNITY_PROPOSALS":
      return PoEContractType.OVERSIGHT_COMMUNITY_PROPOSALS;
    case 8:
    case "COMMUNITY_POOL":
      return PoEContractType.COMMUNITY_POOL;
    case 9:
    case "VALIDATOR_VOTING":
      return PoEContractType.VALIDATOR_VOTING;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PoEContractType.UNRECOGNIZED;
  }
}

export function poEContractTypeToJSON(object: PoEContractType): string {
  switch (object) {
    case PoEContractType.UNDEFINED:
      return "UNDEFINED";
    case PoEContractType.STAKING:
      return "STAKING";
    case PoEContractType.VALSET:
      return "VALSET";
    case PoEContractType.ENGAGEMENT:
      return "ENGAGEMENT";
    case PoEContractType.MIXER:
      return "MIXER";
    case PoEContractType.DISTRIBUTION:
      return "DISTRIBUTION";
    case PoEContractType.OVERSIGHT_COMMUNITY:
      return "OVERSIGHT_COMMUNITY";
    case PoEContractType.OVERSIGHT_COMMUNITY_PROPOSALS:
      return "OVERSIGHT_COMMUNITY_PROPOSALS";
    case PoEContractType.COMMUNITY_POOL:
      return "COMMUNITY_POOL";
    case PoEContractType.VALIDATOR_VOTING:
      return "VALIDATOR_VOTING";
    default:
      return "UNKNOWN";
  }
}

/** Params defines the parameters for the PoE module. */
export interface Params {
  /** HistoricalEntries is the number of historical entries to persist. */
  historicalEntries: number;
  /**
   * InitialValEngagementPoints defines the number of engagement for any new
   * validator joining post genesis
   */
  initialValEngagementPoints: Long;
  /**
   * MinDelegationAmount defines the minimum amount a post genesis validator
   * needs to self delegate to receive any engagement points. One must be
   * exceeded. No minimum condition set when empty.
   */
  minDelegationAmounts: Coin[];
}

const baseParams: object = { historicalEntries: 0, initialValEngagementPoints: Long.UZERO };

export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.historicalEntries !== 0) {
      writer.uint32(8).uint32(message.historicalEntries);
    }
    if (!message.initialValEngagementPoints.isZero()) {
      writer.uint32(16).uint64(message.initialValEngagementPoints);
    }
    for (const v of message.minDelegationAmounts) {
      Coin.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseParams } as Params;
    message.minDelegationAmounts = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.historicalEntries = reader.uint32();
          break;
        case 2:
          message.initialValEngagementPoints = reader.uint64() as Long;
          break;
        case 3:
          message.minDelegationAmounts.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Params {
    const message = { ...baseParams } as Params;
    message.minDelegationAmounts = [];
    if (object.historicalEntries !== undefined && object.historicalEntries !== null) {
      message.historicalEntries = Number(object.historicalEntries);
    } else {
      message.historicalEntries = 0;
    }
    if (object.initialValEngagementPoints !== undefined && object.initialValEngagementPoints !== null) {
      message.initialValEngagementPoints = Long.fromString(object.initialValEngagementPoints);
    } else {
      message.initialValEngagementPoints = Long.UZERO;
    }
    if (object.minDelegationAmounts !== undefined && object.minDelegationAmounts !== null) {
      for (const e of object.minDelegationAmounts) {
        message.minDelegationAmounts.push(Coin.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    message.historicalEntries !== undefined && (obj.historicalEntries = message.historicalEntries);
    message.initialValEngagementPoints !== undefined &&
      (obj.initialValEngagementPoints = (message.initialValEngagementPoints || Long.UZERO).toString());
    if (message.minDelegationAmounts) {
      obj.minDelegationAmounts = message.minDelegationAmounts.map((e) => (e ? Coin.toJSON(e) : undefined));
    } else {
      obj.minDelegationAmounts = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Params>): Params {
    const message = { ...baseParams } as Params;
    message.historicalEntries = object.historicalEntries ?? 0;
    if (object.initialValEngagementPoints !== undefined && object.initialValEngagementPoints !== null) {
      message.initialValEngagementPoints = object.initialValEngagementPoints as Long;
    } else {
      message.initialValEngagementPoints = Long.UZERO;
    }
    message.minDelegationAmounts = [];
    if (object.minDelegationAmounts !== undefined && object.minDelegationAmounts !== null) {
      for (const e of object.minDelegationAmounts) {
        message.minDelegationAmounts.push(Coin.fromPartial(e));
      }
    }
    return message;
  },
};

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
