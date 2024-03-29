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
  readonly trustedTokenCodeId: number;
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
  trustedTokenCodeId: 11,
};

const tgradeInternal: NetworkConfig = {
  chainId: "tgrade-internal-14",
  chainName: "Tgrade-internal-14",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.internal-14.tgrade.confio.run",
  httpUrl: "https://api.internal-14.tgrade.confio.run",
  faucetUrl: "",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.05utgd"),
  factoryAddress: "tgrade10v0hrjvwwlqwvk2yhwagm9m9h385spxa4s54f4aekhap0lxyekys20x6y2",
  trustedTokenCodeId: 14,
};

const tgradeTestnet: NetworkConfig = {
  chainId: "tgrade-demo-1",
  chainName: "Tgrade-demo-1",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.demo-1.tgrade.confio.run",
  httpUrl: "https://api.demo-1.tgrade.confio.run",
  faucetUrl: "https://faucet.demo-1.tgrade.confio.run",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.05utgd"),
  factoryAddress: "tgrade1657pee2jhf4jk8pq6yq64e758ngvum45gl866knmjkd83w6jgn3smag42h",
  trustedTokenCodeId: 11,
};

const tgradeMainnet: NetworkConfig = {
  chainId: "tgrade-mainnet-1",
  chainName: "Tgrade-mainnet-1",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.mainnet-1.tgrade.confio.run",
  httpUrl: "https://api.mainnet-1.tgrade.confio.run",
  faucetUrl: "",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.05utgd"),
  factoryAddress: "tgrade1657pee2jhf4jk8pq6yq64e758ngvum45gl866knmjkd83w6jgn3smag42h",
  trustedTokenCodeId: 11,
};

const configs: NetworkConfigs = { local, tgradeInternal, tgradeTestnet, tgradeMainnet };
export const config = getAppConfig(configs);
