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
  readonly factoryAddress: string;
  readonly codeIds?: {
    readonly tgradeDso?: readonly [number, ...number[]];
    readonly cw20Tokens?: readonly [number, ...number[]];
    readonly tgradeCw20?: readonly [number, ...number[]];
    readonly tgradeFactory?: readonly [number, ...number[]];
    readonly tgradePair?: readonly [number, ...number[]];
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

// local docker deployment
const local: NetworkConfig = {
  chainId: "chain-JAynv8",
  chainName: "Local Testing",
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
  factoryAddress: "tgrade1fventeva948ue0fzhp6xselr522rnqwgp5c9qv",
  codeIds: {
    // The first 8 codeIds are reserved by tgrade automatically when launched
    tgradeDso: [2],
    cw20Tokens: [9],
    tgradeCw20: [10],
    tgradeFactory: [11],
    tgradePair: [12],
  },
};

const tgradeInternal: NetworkConfig = {
  chainId: "tgrade-internal-7",
  chainName: "Tgrade-internal-7",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.internal-7.tgrade.io",
  httpUrl: "https://lcd.internal-7.tgrade.io",
  faucetUrl: "https://faucet.internal-7.tgrade.io",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.025utgd"),
  factoryAddress: "tgrade1fventeva948ue0fzhp6xselr522rnqwgp5c9qv",
  codeIds: {
    // The first 8 codeIds are reserved by tgrade automatically when launched
    tgradeDso: [2],
    cw20Tokens: [9],
    tgradeCw20: [10],
    tgradeFactory: [11],
    tgradePair: [12],
  },
};

const tgradeTestnet: NetworkConfig = {
  chainId: "tgrade-testnet-3",
  chainName: "Tgrade-testnet-3",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.testnet-3.tgrade.io",
  httpUrl: "https://lcd.testnet-3.tgrade.io",
  faucetUrl: "https://faucet.testnet-3.tgrade.io",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.05utgd"),
  factoryAddress: "tgrade1fventeva948ue0fzhp6xselr522rnqwgp5c9qv",
  codeIds: {
    // The first 8 codeIds are reserved by tgrade automatically when launched
    tgradeDso: [2],
    cw20Tokens: [9],
    tgradeCw20: [10],
    tgradeFactory: [11],
    tgradePair: [12],
  },
};

const configs: NetworkConfigs = { local, tgradeInternal, tgradeTestnet };
export const config = getAppConfig(configs);
