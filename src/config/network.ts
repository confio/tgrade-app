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
  gasPrice: GasPrice.fromString("0.05utgd"),
  factoryAddress: "tgrade1657pee2jhf4jk8pq6yq64e758ngvum45gl866knmjkd83w6jgn3smag42h",
  codeIds: {
    // The first 9 codeIds are reserved by tgrade automatically when launched
    tgradeDso: [2],
    cw20Tokens: [10],
    tgradeCw20: [11],
    tgradeFactory: [12],
    tgradePair: [13],
  },
};

const tgradeInternal: NetworkConfig = {
  chainId: "tgrade-internal-11",
  chainName: "Tgrade-internal-11",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.internal-11.tgrade.confio.run",
  httpUrl: "https://lcd.internal-11.tgrade.confio.run",
  faucetUrl: "https://faucet.internal-11.tgrade.confio.run",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.05utgd"),
  factoryAddress: "tgrade1657pee2jhf4jk8pq6yq64e758ngvum45gl866knmjkd83w6jgn3smag42h",
  codeIds: {
    // The first 9 codeIds are reserved by tgrade automatically when launched
    tgradeDso: [2],
    cw20Tokens: [10],
    tgradeCw20: [11],
    tgradeFactory: [12],
    tgradePair: [13],
  },
};

const tgradeTestnet: NetworkConfig = {
  chainId: "tgrade-dryrunnet",
  chainName: "Tgrade-dryrunnet",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.dryrunnet.tgrade.confio.run",
  httpUrl: "https://lcd.dryrunnet.tgrade.confio.run",
  faucetUrl: "https://faucet.dryrunnet.tgrade.confio.run",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.05utgd"),
  factoryAddress: "tgrade1657pee2jhf4jk8pq6yq64e758ngvum45gl866knmjkd83w6jgn3smag42h",
  codeIds: {
    // The first 9 codeIds are reserved by tgrade automatically when launched
    tgradeDso: [2],
    cw20Tokens: [10],
    tgradeCw20: [11],
    tgradeFactory: [12],
    tgradePair: [13],
  },
};

const configs: NetworkConfigs = { local, tgradeInternal, tgradeTestnet };
export const config = getAppConfig(configs);
