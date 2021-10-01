import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Decimal } from "@cosmjs/math";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { MouseEventHandler } from "react";

type Position = "Top" | "Bottom";
export interface TokenRowProps {
  title: string;
  id?: string;
  token: TokenProps | undefined;
  maxButton?: boolean;
  error?: string;
  position: Position;
  tokens: Array<TokenProps>;
  onMaxClick?: MouseEventHandler;
  hideSelectToken?: boolean;
  setToken: any;
  setPair?: (pair: PairProps) => void;
  onChange?: () => void;
}

export interface SwapFormValues {
  To: number;
  From: number;
  selectFrom: TokenProps | undefined;
  selectTo: TokenProps | undefined;
}
export interface WithdrawFormValues {
  To: string;
  From: number;
  selectFrom: TokenProps | undefined;
  selectTo: TokenProps | undefined;
}
export interface ProvideFormValues {
  assetA: number;
  assetB: number;
  selectFrom: TokenProps | undefined;
  selectTo: TokenProps | undefined;
}
export interface tokenObj {
  token?: string;
  native?: string;
}
export interface PairProps {
  asset_infos: tokenObj[];
  contract_addr: string;
  liquidity_token: string;
}
export interface TokenProps {
  address: string;
  balance: string;
  humanBalance: string;
  decimals: number;
  name: string;
  symbol: string;
  total_supply: string;
  img?: string;
}

export interface InitialValuesInterface {
  address: string;
  amount: string;
}
export interface MinterInterface {
  minter: string;
  cap: number;
}
export class Token {
  static readonly GAS_SWAP = 500_000;
  static readonly GAS_PROVIDE_LIQUIDITY = 500_000;
  static readonly GAS_WITHDRAW_LIQUIDITY = 500_000;

  readonly #signingClient: SigningCosmWasmClient;

  constructor(address: string, signingClient: SigningCosmWasmClient) {
    this.#signingClient = signingClient;
  }

  static async getSimulation(
    client: CosmWasmClient,
    pair: PairProps,
    form: SwapFormValues,
  ): Promise<SimulatedSwap | null> {
    if (!form.selectFrom || !form.selectTo) return null;

    const amount = Decimal.fromUserInput(
      form.From.toFixed(form.selectFrom?.decimals),
      form.selectFrom?.decimals,
    ).atomics;
    try {
      if (form.selectFrom?.address === "utgd") {
        const result: SimulatedSwap = await client.queryContractSmart(pair.contract_addr, {
          simulation: {
            offer_asset: {
              amount: amount,
              info: {
                native: "utgd",
              },
            },
          },
        });
        const resultToDecimal: SimulatedSwap = {
          commission_amount: Decimal.fromAtomics(
            result.commission_amount,
            form.selectTo?.decimals,
          ).toString(),
          spread_amount: Decimal.fromAtomics(result.spread_amount, form.selectTo?.decimals).toString(),
          return_amount: Decimal.fromAtomics(result.return_amount, form.selectTo?.decimals).toString(),
        };

        return resultToDecimal;
      } else {
        const result = await client.queryContractSmart(pair.contract_addr, {
          simulation: {
            offer_asset: {
              amount: amount,
              info: {
                token: form.selectFrom?.address,
              },
            },
          },
        });
        const resultToDecimal: SimulatedSwap = {
          commission_amount: Decimal.fromAtomics(
            result.commission_amount,
            form.selectTo?.decimals,
          ).toString(),
          spread_amount: Decimal.fromAtomics(result.spread_amount, form.selectTo?.decimals).toString(),
          return_amount: Decimal.fromAtomics(result.return_amount, form.selectTo?.decimals).toString(),
        };
        return resultToDecimal;
      }
    } catch (error) {
      console.error(error);
      const result: SimulatedSwap = {
        commission_amount: "1",
        spread_amount: "1",
        return_amount: "1",
      };
      return result;
    }
  }
  static async getSimulationReverse(
    client: CosmWasmClient,
    pair: PairProps,
    form: SwapFormValues,
  ): Promise<SimulatedSwap | null> {
    if (!form.selectFrom || !form.selectTo) return null;

    const amount = Decimal.fromUserInput(form.To.toFixed(form.selectTo?.decimals), form.selectTo?.decimals)
      .atomics;
    try {
      if (form.selectTo?.address === "utgd") {
        const result: SimulatedSwapReverse = await client.queryContractSmart(pair.contract_addr, {
          reverse_simulation: {
            ask_asset: {
              amount: amount,
              info: {
                native: "utgd",
              },
            },
          },
        });
        const resultToDecimal: SimulatedSwap = {
          commission_amount: Decimal.fromAtomics(
            result.commission_amount,
            form.selectTo?.decimals,
          ).toString(),
          spread_amount: Decimal.fromAtomics(result.spread_amount, form.selectTo?.decimals).toString(),
          return_amount: Decimal.fromAtomics(result.offer_amount, form.selectTo?.decimals).toString(),
        };

        return resultToDecimal;
      } else {
        const result = await client.queryContractSmart(pair.contract_addr, {
          reverse_simulation: {
            ask_asset: {
              amount: amount,
              info: {
                token: form.selectTo?.address,
              },
            },
          },
        });
        const resultToDecimal: SimulatedSwap = {
          commission_amount: Decimal.fromAtomics(
            result.commission_amount,
            form.selectTo?.decimals,
          ).toString(),
          spread_amount: Decimal.fromAtomics(result.spread_amount, form.selectTo?.decimals).toString(),
          return_amount: Decimal.fromAtomics(result.offer_amount, form.selectTo?.decimals).toString(),
        };
        return resultToDecimal;
      }
    } catch (error) {
      console.error(error);
      const result: SimulatedSwap = {
        commission_amount: "1",
        spread_amount: "1",
        return_amount: "1",
      };
      return result;
    }
  }

  static async Swap(
    singingClient: SigningCosmWasmClient,
    address: string,
    pair: PairProps,
    form: SwapFormValues,
    gasPrice: GasPrice,
  ): Promise<any> {
    if (!form.selectFrom) return;

    //Parsing input to decimals, example using utgd:
    //User Input-> 1
    //parsed to decimals -> 1000000
    const amount = Decimal.fromUserInput(
      form.From.toFixed(form.selectFrom?.decimals),
      form.selectFrom.decimals,
    ).atomics;

    if (form.selectFrom?.address === "utgd") {
      const result = await singingClient.execute(
        address,
        pair.contract_addr,
        {
          swap: {
            offer_asset: {
              amount: amount,
              info: {
                native: "utgd",
              },
            },
          },
        },
        calculateFee(Token.GAS_SWAP, gasPrice),
        "",
        [{ denom: "utgd", amount: amount }],
      );
      return result;
    } else {
      const result = await singingClient.execute(
        address,
        form.selectFrom?.address,
        {
          send: {
            contract: pair.contract_addr,
            amount: amount,
            //TODO make spread dynamic
            msg: "eyJzd2FwIjp7Im1heF9zcHJlYWQiOiIwLjI1In19Cg",
          },
        },
        calculateFee(Token.GAS_SWAP, gasPrice),
      );
      return result;
    }
  }
}

export class Pair {
  static async queryPair(client: CosmWasmClient, pairAddress: string): Promise<any> {
    const result = await client.queryContractSmart(pairAddress, {
      pair: {},
    });

    return result;
  }
  static getPair(
    pairs: { [key: string]: PairProps },
    addressA: string,
    addressB: string,
  ): PairProps | undefined {
    return pairs[`${addressA}-${addressB}`] || pairs[`${addressB}-${addressA}`];
  }
}

export class Pool {
  static async queryPool(client: CosmWasmClient, pairAddress: string): Promise<any> {
    const result = await client.queryContractSmart(pairAddress, {
      pool: {},
    });

    return result;
  }
  static async getPoolExtraInfo(
    client: CosmWasmClient,
    pairAddress: string,
    values: ProvideFormValues,
    _pool?: PoolProps,
  ): Promise<ExtraInfoProvide | null> {
    if (!values.selectTo || !values.selectFrom || !client) return null;
    let pool: PoolProps | undefined;
    if (!_pool) {
      pool = await this.queryPool(client, pairAddress);
    } else {
      pool = _pool;
    }
    if (!pool) return null;
    const poolA = pool.assets.find(
      (asset) =>
        asset.info.native === values.selectFrom?.address || asset.info.token === values.selectFrom?.address,
    );
    const poolB = pool.assets.find(
      (asset) =>
        asset.info.native === values.selectTo?.address || asset.info.token === values.selectTo?.address,
    );

    if (!poolA || !poolB) return null;
    const pools =
      Decimal.fromAtomics(poolA?.amount, values.selectFrom?.decimals).toFloatApproximation() /
      Decimal.fromAtomics(poolB?.amount, values.selectTo?.decimals).toFloatApproximation();
    const price = numberFormat.format(pools);
    const priceReverse = numberFormat.format(1 / pools);

    const amountA = parseFloat(
      Decimal.fromUserInput(values.assetA.toString(), values.selectFrom.decimals).toString(),
    );
    const amountB = parseFloat(
      Decimal.fromUserInput(values.assetB.toString(), values.selectTo.decimals).toString(),
    );

    let gainedShareOfPool, LPFromTX: string;
    const gainedShareOfPoolB = amountB / (parseFloat(poolB.amount) + amountB);
    const gainedShareOfPoolA = amountA / (parseFloat(poolA.amount) + amountA);

    if (gainedShareOfPoolA > gainedShareOfPoolB) {
      gainedShareOfPool = shareOfPoolNumberFormat.format(gainedShareOfPoolB * 100);
      LPFromTX = (parseFloat(pool.total_share) * gainedShareOfPoolA).toFixed(6);
    } else {
      gainedShareOfPool = shareOfPoolNumberFormat.format(gainedShareOfPoolA * 100);
      LPFromTX = (parseFloat(pool.total_share) * gainedShareOfPoolB).toFixed(6);
    }

    return {
      priceReverse: priceReverse,
      price: price,
      lpFromTx: LPFromTX,
      gainedShareOfPool: gainedShareOfPool,
    };
  }
  static async ProvideLiquidity(
    signingClient: SigningCosmWasmClient,
    contractAddress: string,
    address: string,
    values: ProvideFormValues,
    gasPrice: GasPrice,
  ): Promise<any> {
    if (!values.selectTo || !values.selectFrom) return;
    const keyTokenA = values.selectFrom?.address === "utgd" ? "native" : "token";
    const keyTokenB = values.selectTo?.address === "utgd" ? "native" : "token";

    const amountA = Decimal.fromUserInput(
      values.assetA.toFixed(values.selectFrom?.decimals),
      values.selectFrom?.decimals,
    ).atomics;
    const amountB = Decimal.fromUserInput(
      values.assetB.toFixed(values.selectTo?.decimals),
      values.selectTo?.decimals,
    ).atomics;

    const demon = values.selectFrom.address === "utgd" ? amountA : amountB;

    const provideMessage = {
      provide_liquidity: {
        assets: [
          {
            amount: amountA,
            info: {
              [keyTokenA]: values.selectFrom?.address,
            },
          },
          {
            amount: amountB,
            info: {
              [keyTokenB]: values.selectTo?.address,
            },
          },
        ],
      },
    };
    const funds =
      values.selectFrom?.address === "utgd" || values.selectTo?.address === "utgd"
        ? [{ denom: "utgd", amount: demon }]
        : [];

    const result = await signingClient.execute(
      address,
      contractAddress,
      provideMessage,
      calculateFee(Token.GAS_PROVIDE_LIQUIDITY, gasPrice),
      `Add liquidity to ${values.selectFrom.symbol}-${values.selectTo.symbol} pool`,
      funds,
    );
    return result;
  }
  static async WithdrawLiquidity(
    signingClient: SigningCosmWasmClient,
    address: string,
    pair: PairProps,
    values: WithdrawFormValues,
    gasPrice: GasPrice,
  ): Promise<any> {
    if (!values.selectFrom) return;
    const amount = Decimal.fromUserInput(
      values.From.toFixed(values.selectFrom?.decimals),
      values.selectFrom?.decimals,
    ).atomics;
    const withdrawMsj: Record<string, unknown> = {
      send: {
        contract: pair.contract_addr,
        amount: amount,
        msg: btoa(JSON.stringify({ withdraw_liquidity: {} })),
      },
    };

    const result = await signingClient.execute(
      address,
      pair.liquidity_token,
      withdrawMsj,
      calculateFee(Token.GAS_WITHDRAW_LIQUIDITY, gasPrice),
      `Withdraw liquidity from ${values.selectFrom.name}`,
    );
    return result;
  }
}
export interface SimulatedSwap {
  return_amount: string;
  spread_amount: string;
  commission_amount: string;
}
export interface SimulatedSwapReverse {
  offer_amount: string;
  spread_amount: string;
  commission_amount: string;
}
export interface SimulationProvide {
  return_amount: string;
  spread_amount: string;
  commission_amount: string;
}
export interface ExtraInfoProvide {
  price: string;
  priceReverse: string;
  lpFromTx: string;
  gainedShareOfPool: string;
}

export interface DetailSwap {
  from: string;
  to: string;
  spread: string;
  commission: string;
  txHash: string;
  fee: string;
}
export interface DetailProvide {
  providedA: string;
  providedB: string;
  received: string;
  txHash: string;
  fee: string;
}
export interface PoolProps {
  assets: Array<{
    amount: string;
    info: {
      native?: string;
      token?: string;
    };
  }>;
  total_share: string;
}
export interface LPToken {
  token: TokenProps;
  pair: PairProps;
}
export interface DetailWithdraw {
  withdrawTokenA: string;
  withdrawTokenB: string;
  priceImpact: string;
  txHash: string;
  burned: string;
  lpAfter: string;
  sharePool: string;
  fee: string;
}

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
  useGrouping: true,
});
const shareOfPoolNumberFormat = new Intl.NumberFormat("en", {
  maximumFractionDigits: 10,
});
