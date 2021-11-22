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
  factoryAddress: "tgrade1gurgpv8savnfw66lckwzn4zk7fp394lp9sqaw4",
  codeIds: {
    // The first 6 codeIds are reserved by tgrade automatically when launched
    tgradeDso: [2],
    cw20Tokens: [7],
    tgradeCw20: [8],
    tgradeFactory: [9],
    tgradePair: [10],
  },
};

const tgradeInternal5: NetworkConfig = {
  chainId: "tgrade-internal-5",
  chainName: "Tgrade-internal-5",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.internal-5.tgrade.io",
  httpUrl: "https://lcd.internal-5.tgrade.io",
  faucetUrl: "https://faucet.internal-5.tgrade.io",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.025utgd"),
  factoryAddress: "tgrade1gurgpv8savnfw66lckwzn4zk7fp394lp9sqaw4",
  codeIds: {
    // The first 5 codeIds are reserved by tgrade automatically when launched
    tgradeDso: [2],
    cw20Tokens: [7],
    tgradeCw20: [8],
    tgradeFactory: [9],
    tgradePair: [10],
  },
};

const tgradeTestnet2: NetworkConfig = {
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
  gasPrice: GasPrice.fromString("0.025utgd"),
  factoryAddress: "tgrade14ejqjyq8um4p3xfqj74yld5waqljf88fysvrq7",
  codeIds: {
    tgradeDso: [5],
    cw20Tokens: [6],
    tgradeCw20: [7],
    tgradeFactory: [8],
    tgradePair: [9],
  },
};

const configs: NetworkConfigs = { local, tgradeInternal5, tgradeTestnet2 };
export const config = getAppConfig(configs);
