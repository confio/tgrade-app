import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { paths } from "App/paths";
import { NetworkConfig } from "config/network";
import { SwapButtonState } from "service/exchange";
import { FormErrors } from "service/tmarket";
import { Contract20WS } from "utils/cw20";
import {
  DetailSwap,
  Pair,
  PairProps,
  Pool,
  PoolProps,
  SimulatedSwap,
  SwapFormValues,
  Token,
  TokenProps,
} from "utils/tokens";
import { toast } from "react-toastify";
import { getErrorFromStackTrace } from "utils/errors";

export const handleValidation = async (
  values: SwapFormValues,
  client: CosmWasmClient | undefined,
  address: string | undefined,
  swapButton: SwapButtonState,
  pairs: { [key: string]: PairProps },
  setPair: (pair: PairProps | undefined) => void,
  setSwapButtonState: (button: SwapButtonState) => void,
  setErrors: (errors: FormErrors) => void,
): Promise<void> => {
  if (!client || !address || !values.selectFrom || !values.selectTo || !pairs) return;

  if (values.selectFrom?.address === values.selectTo?.address) {
    console.error("Cannot set the same tokens in swap");
    values.selectTo = undefined;
  }

  if (!values.selectTo) return;
  //CHECK if has pair
  const pair: PairProps | undefined = Pair.getPair(pairs, values.selectFrom.address, values.selectTo.address);
  //UPDATE state if not existing pair
  if (!pair && swapButton.type !== "not_exits") {
    setSwapButtonState({ title: "Pair doesn't exist", type: "not_exits" });
  } else if (pair) {
    const pool: PoolProps = await Pool.queryPool(client, pair?.contract_addr);
    if (parseFloat(pool.total_share) === 0) {
      setSwapButtonState({ title: "Insufficient Liquidity", type: "no_liquidity" });
    } else {
      setSwapButtonState({ title: "Swap", type: "swap" });
    }
    setPair(pair);
  }
  //Errors
  const errors: FormErrors = {
    to: undefined,
    from: undefined,
  };
  if (values.From > parseFloat(values.selectFrom.humanBalance)) {
    errors.from = "Insufficient Balance";
  }

  setErrors(errors);
};

export const handleSubmit = async (
  values: SwapFormValues,
  signingClient: SigningCosmWasmClient | undefined,
  client: CosmWasmClient | undefined,
  address: string | undefined,
  setLoading: (loading: boolean) => void,
  selectedPair: PairProps | undefined,
  config: NetworkConfig,
  simulation: SimulatedSwap | undefined,
  setSimulation: (a: SimulatedSwap | undefined) => void,
  setDetailSwap: (a: DetailSwap | undefined) => void,
  history: any,
  refreshToken: (t: TokenProps) => void,
  setModalOpen: (b: boolean) => void,
): Promise<void> => {
  if (!address) {
    setModalOpen(true);
  }
  if (!values.selectTo || !values.selectFrom || !signingClient || !address || !client) return;

  setLoading(true);

  if (values.From && signingClient && selectedPair && simulation) {
    try {
      const swap_result = await Token.Swap(signingClient, address, selectedPair, values);

      setDetailSwap({
        from: `${values.From} ${values.selectFrom.symbol}`,
        to: `${values.To} ${values.selectTo.symbol}`,
        spread: `${simulation.spread_amount} ${values.selectTo.symbol}`,
        commission: `${simulation.commission_amount} ${values.selectTo.symbol}`,
        txHash: swap_result.transactionHash,
        fee: (Number(config.gasPrice.amount) / 2).toString(),
      });
      setSimulation(undefined);
      //Update balance
      const tokenA = await Contract20WS.getTokenInfo(client, address, values.selectFrom.address, config);
      const tokenB = await Contract20WS.getTokenInfo(client, address, values.selectTo.address, config);
      refreshToken(tokenA);
      refreshToken(tokenB);
      history.push(`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}${paths.tmarket.exchange.result}`);
    } catch (e) {
      const error = getErrorFromStackTrace(e.message);
      console.error(error);
      toast.error(error);
      setLoading(false);
    }
  }

  setLoading(false);
};
