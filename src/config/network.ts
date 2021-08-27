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
    // note that tgrade has a number of internal contracts... you will probably have to bump this number a bit
    tgradeDso: [4],
    cw20Tokens: [15],
    tgradeCw20: [5],
    tgradeFactory: [13],
    tgradePair: [14],
  },
};

const configs: NetworkConfigs = { local, tgradeinternal };
export const config = getAppConfig(configs);
