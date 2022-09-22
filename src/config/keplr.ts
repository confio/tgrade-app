import { NetworkConfig } from "./network";

export interface KeplrCoin {
  readonly coinDenom: string;
  readonly coinMinimalDenom: string;
  readonly coinDecimals: number;
  readonly gasPriceStep: {
    readonly low: number;
    readonly average: number;
    readonly high: number;
  };
}

export interface KeplrConfig {
  readonly chainId: string;
  readonly chainName: string;
  readonly rpc: string;
  readonly rest: string;
  readonly bech32Config: {
    readonly bech32PrefixAccAddr: string;
    readonly bech32PrefixAccPub: string;
    readonly bech32PrefixValAddr: string;
    readonly bech32PrefixValPub: string;
    readonly bech32PrefixConsAddr: string;
    readonly bech32PrefixConsPub: string;
  };
  readonly currencies: KeplrCoin[];
  readonly feeCurrencies: KeplrCoin[];
  readonly stakeCurrency: KeplrCoin;
  readonly bip44: { readonly coinType: number };
  readonly coinType: number;
}

export function configKeplr(config: NetworkConfig): KeplrConfig {
  return {
    chainId: config.chainId,
    chainName: config.chainName,
    rpc: config.rpcUrl,
    rest: config.httpUrl,
    bech32Config: {
      bech32PrefixAccAddr: `${config.addressPrefix}`,
      bech32PrefixAccPub: `${config.addressPrefix}`,
      bech32PrefixValAddr: `${config.addressPrefix}`,
      bech32PrefixValPub: `${config.addressPrefix}`,
      bech32PrefixConsAddr: `${config.addressPrefix}`,
      bech32PrefixConsPub: `${config.addressPrefix}`,
    },
    currencies: [
      {
        coinDenom: config.coinMap[config.feeToken].denom,
        coinMinimalDenom: config.feeToken,
        coinDecimals: config.coinMap[config.feeToken].fractionalDigits,
        gasPriceStep: {
          low: config.gasPrice.amount.toFloatApproximation(),
          average: config.gasPrice.amount.toFloatApproximation() * 1.5,
          high: config.gasPrice.amount.toFloatApproximation() * 2,
        },
      },
    ],
    feeCurrencies: [
      {
        coinDenom: config.coinMap[config.feeToken].denom,
        coinMinimalDenom: config.feeToken,
        coinDecimals: config.coinMap[config.feeToken].fractionalDigits,
        gasPriceStep: {
          low: config.gasPrice.amount.toFloatApproximation(),
          average: config.gasPrice.amount.toFloatApproximation() * 1.5,
          high: config.gasPrice.amount.toFloatApproximation() * 2,
        },
      },
    ],
    stakeCurrency: {
      coinDenom: config.coinMap[config.stakingToken].denom,
      coinMinimalDenom: config.stakingToken,
      coinDecimals: config.coinMap[config.stakingToken].fractionalDigits,
      gasPriceStep: {
        low: config.gasPrice.amount.toFloatApproximation(),
        average: config.gasPrice.amount.toFloatApproximation() * 1.5,
        high: config.gasPrice.amount.toFloatApproximation() * 2,
      },
    },
    bip44: { coinType: 118 },
    coinType: 118,
  };
}
