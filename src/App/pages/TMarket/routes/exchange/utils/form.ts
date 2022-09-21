import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { paths } from "App/paths";
import { NetworkConfig } from "config/network";
import { toast } from "react-toastify";
import { SwapButtonState } from "service/exchange";
import { FormErrors } from "service/tmarket";
import { gtagTMarketAction } from "utils/analytics";
import { getErrorFromStackTrace } from "utils/errors";
import { Factory } from "utils/factory";
import {
  DetailSwap,
  Pair,
  Pool,
  PoolContract,
  SimulatedSwap,
  SwapFormValues,
  TokenContract,
} from "utils/tokens";

export const handleValidation = async (
  values: SwapFormValues,
  client: CosmWasmClient | undefined,
  address: string | undefined,
  swapButton: SwapButtonState,
  factoryAddress: string,
  setPair: (pair: Pair | undefined) => void,
  setSwapButtonState: (button: SwapButtonState) => void,
  setErrors: (errors: FormErrors) => void,
): Promise<void> => {
  if (!client || !address || !values.selectFrom || !values.selectTo) return;

  //CHECK if has pair
  const tokenObjA =
    values.selectFrom.address === "utgd"
      ? { native: values.selectFrom.address }
      : { token: values.selectFrom.address };
  const tokenObjB =
    values.selectTo.address === "utgd"
      ? { native: values.selectTo.address }
      : { token: values.selectTo.address };
  const pair = await Factory.getPair(client, factoryAddress, [tokenObjA, tokenObjB]);
  //UPDATE state if not existing pair
  if (!pair && swapButton.type !== "not_exits") {
    setSwapButtonState({ title: "Pair doesn't exist", type: "not_exits" });
  } else if (pair) {
    const pool: Pool = await PoolContract.queryPool(client, pair?.contract_addr);
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
  if (Number(values.From) > Number(values.selectFrom.humanBalance)) {
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
  selectedPair: Pair | undefined,
  config: NetworkConfig,
  simulation: SimulatedSwap | undefined,
  setSimulation: (a: SimulatedSwap | undefined) => void,
  setDetailSwap: (a: DetailSwap | undefined) => void,
  history: any,
  setModalOpen: (b: boolean) => void,
): Promise<void> => {
  gtagTMarketAction("exchange_try");
  if (!address) {
    setModalOpen(true);
  }
  if (!values.selectTo || !values.selectFrom || !signingClient || !address || !client) return;

  setLoading(true);

  if (values.From && signingClient && selectedPair && simulation) {
    try {
      const swap_result = await TokenContract.Swap(
        signingClient,
        address,
        selectedPair,
        values,
        config.gasPrice,
      );
      gtagTMarketAction("exchange_success");

      setDetailSwap({
        from: `${values.From} ${values.selectFrom.symbol}`,
        to: `${values.To} ${values.selectTo.symbol}`,
        spread: `${simulation.spread_amount} ${values.selectTo.symbol}`,
        commission: `${simulation.commission_amount} ${values.selectTo.symbol}`,
        txHash: swap_result.transactionHash,
        fee: (Number(config.gasPrice.amount) / 2).toString(),
      });
      setSimulation(undefined);
      history.push(`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}${paths.tmarket.exchange.result}`);
    } catch (e) {
      if (!(e instanceof Error)) return;
      const error = getErrorFromStackTrace(e);
      console.error(error);
      toast.error(error, { toastId: "t-market-toast-id" });
      setLoading(false);
    }
  }

  setLoading(false);
};
