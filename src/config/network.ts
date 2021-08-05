import { GasPrice } from "@cosmjs/stargate";
import { CoinMap } from "utils/currency";

export interface NetworkConfig {
  readonly chainId: string;
  readonly chainName: string;
  readonly addressPrefix: string;
  readonly rpcUrl: string;
  readonly httpUrl: string;
  readonly faucetUrl: string;
  readonly feeToken: string;
  readonly faucetTokens?: readonly [string, ...string[]];
  readonly stakingToken: string;
  readonly coinMap: CoinMap;
  readonly gasPrice: GasPrice;
  readonly codeIds?: {
    readonly cw20Tokens?: readonly [number, ...number[]];
    readonly tgradeDso?: readonly [number, ...number[]];
  };
}

export interface NetworkConfigs {
  readonly local: NetworkConfig;
  readonly [key: string]: NetworkConfig;
}

export function getAppConfig(configs: NetworkConfigs): NetworkConfig {
  const network = process.env.REACT_APP_NETWORK;
  if (!network) return configs.local;

  const config = configs[network];
  if (!config) {
    throw new Error(`No configuration found for network ${network}`);
  }

  return config;
}

const local: NetworkConfig = {
  chainId: "chain-5gDkX0",
  chainName: "Testing",
  addressPrefix: "tgrade",
  rpcUrl: "http://localhost:26657",
  httpUrl: "http://localhost:1317",
  faucetUrl: "http://localhost:8000",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.025utgd"),
  codeIds: {
    tgradeDso: [1],
  },
};

/* const musselnet: NetworkConfig = {
  chainId: "musselnet-4",
  chainName: "Musselnet",
  addressPrefix: "wasm",
  rpcUrl: "https://rpc.musselnet.cosmwasm.com",
  httpUrl: "https://lcd.musselnet.cosmwasm.com",
  faucetUrl: "https://faucet.musselnet.cosmwasm.com",
  feeToken: "umayo",
  stakingToken: "ufrites",
  coinMap: {
    umayo: { denom: "MAYO", fractionalDigits: 6 },
    ufrites: { denom: "FRITES", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.025umayo"),
  codeId: 1,
}; */

const tgradeinternal: NetworkConfig = {
  chainId: "tgrade-internal-1",
  chainName: "Tgrade-internal-1",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.internal-1.tgrade.io",
  httpUrl: "https://lcd.internal-1.tgrade.io",
  faucetUrl: "https://faucet.internal-1.tgrade.io",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.0001utgd"),
  codeIds: {
    tgradeDso: [4],
  },
};

const configs: NetworkConfigs = { local, tgradeinternal };
export const config = getAppConfig(configs);
