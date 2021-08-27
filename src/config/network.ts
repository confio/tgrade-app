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

const local: NetworkConfig = {
  chainId: "chain-tUfpCC",
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
  codeIds: {
    // The first 4 codeIds are reserved by tgrade automatically when launched
    tgradeDso: [5],
    cw20Tokens: [6],
    tgradeCw20: [7],
    tgradeFactory: [8],
    tgradePair: [9],
  },
};

const tgradeTestnet: NetworkConfig = {
  chainId: "tgrade-testnet-2",
  chainName: "Tgrade-testnet-2",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.testnet-2.tgrade.io",
  httpUrl: "https://lcd.testnet-2.tgrade.io",
  faucetUrl: "https://faucet.testnet-2.tgrade.io",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.0001utgd"),
  codeIds: {
    tgradeDso: [5],
    cw20Tokens: [6],
    tgradeCw20: [7],
    tgradeFactory: [8],
    tgradePair: [9],
  },
};

const configs: NetworkConfigs = { local, tgradeTestnet };
export const config = getAppConfig(configs);
