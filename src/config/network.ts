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
  readonly ocAddress: string;
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
  chainId: "chain-hWEH1q",
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
  factoryAddress: "tgrade1tqwwyth34550lg2437m05mjnjp8w7h5kejfw2j",
  ocAddress: "tgrade1j08452mqwadp8xu25kn9rleyl2gufgfjpmnrj3",
  codeIds: {
    // The first 5 codeIds are reserved by tgrade automatically when launched
    tgradeDso: [5],
    cw20Tokens: [6],
    tgradeCw20: [7],
    tgradeFactory: [8],
    tgradePair: [9],
  },
};

const tgradeInternal2: NetworkConfig = {
  chainId: "tgrade-internal-2",
  chainName: "Tgrade-internal-2",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.internal-2.tgrade.io",
  httpUrl: "https://lcd.internal-2.tgrade.io",
  faucetUrl: "https://faucet.internal-2.tgrade.io",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.025utgd"),
  factoryAddress: "tgrade14ejqjyq8um4p3xfqj74yld5waqljf88fysvrq7",
  ocAddress: "tgrade1j08452mqwadp8xu25kn9rleyl2gufgfjpmnrj3",
  codeIds: {
    tgradeDso: [5],
    cw20Tokens: [6],
    tgradeCw20: [7],
    tgradeFactory: [8],
    tgradePair: [9],
  },
};

const tgradeInternal3: NetworkConfig = {
  chainId: "tgrade-internal-3",
  chainName: "Tgrade-internal-3",
  addressPrefix: "tgrade",
  rpcUrl: "https://rpc.internal-3.tgrade.io",
  httpUrl: "https://lcd.internal-3.tgrade.io",
  faucetUrl: "https://faucet.internal-3.tgrade.io",
  feeToken: "utgd",
  stakingToken: "utgd",
  faucetTokens: ["utgd"],
  coinMap: {
    utgd: { denom: "TGD", fractionalDigits: 6 },
  },
  gasPrice: GasPrice.fromString("0.025utgd"),
  factoryAddress: "tgrade13ehuhysn5mqjeaheeuew2gjs785f6k7jgvt3wl",
  ocAddress: "tgrade1j08452mqwadp8xu25kn9rleyl2gufgfjpmnrj3",
  codeIds: {
    tgradeDso: [5],
    cw20Tokens: [9],
    tgradeCw20: [6],
    tgradeFactory: [7],
    tgradePair: [8],
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
  ocAddress: "tgrade1j08452mqwadp8xu25kn9rleyl2gufgfjpmnrj3",
  codeIds: {
    tgradeDso: [5],
    cw20Tokens: [6],
    tgradeCw20: [7],
    tgradeFactory: [8],
    tgradePair: [9],
  },
};

const configs: NetworkConfigs = { local, tgradeInternal2, tgradeInternal3, tgradeTestnet2 };
export const config = getAppConfig(configs);
