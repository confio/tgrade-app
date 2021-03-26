import { CoinMap } from "utils/currency";

export interface NetworkConfig {
  readonly chainId: string;
  readonly chainName: string;
  readonly addressPrefix: string;
  readonly rpcUrl: string;
  readonly httpUrl: string;
  readonly faucetUrl: string;
  readonly feeToken: string;
  readonly faucetTokens?: string[];
  readonly stakingToken: string;
  readonly coinMap: CoinMap;
  readonly gasPrice: number;
  readonly codeId?: number;
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
  chainId: "testing",
  chainName: "Testing",
  addressPrefix: "wasm",
  rpcUrl: "http://localhost:26657",
  httpUrl: "http://localhost:1317",
  faucetUrl: "http://localhost:8000",
  feeToken: "ucosm",
  stakingToken: "ustake",
  faucetTokens: ["ucosm", "ustake"],
  coinMap: {
    ucosm: { denom: "COSM", fractionalDigits: 6 },
    ustake: { denom: "STAKE", fractionalDigits: 6 },
  },
  gasPrice: 0.025,
  codeId: 1,
};

const musselnet: NetworkConfig = {
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
  gasPrice: 0.025,
  codeId: 1,
};

const configs: NetworkConfigs = { local, musselnet };
export const config = getAppConfig(configs);
