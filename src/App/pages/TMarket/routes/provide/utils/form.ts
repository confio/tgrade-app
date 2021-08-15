import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Decimal } from "@cosmjs/math";
import { paths } from "App/paths";
import { NetworkConfig } from "config/network";
import { toast } from "react-toastify";
import { Contract20WS } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { Factory } from "utils/factory";
import {
  DetailProvide,
  Pair,
  PairProps,
  Pool,
  ProvideFormValues,
  SimulationProvide,
  SwapFormValues,
  TokenProps,
} from "utils/tokens";
import { FormErrors, provideButtonState } from "service/provide";

export const handleValidation = async (
  values: ProvideFormValues,
  client: CosmWasmClient | undefined,
  address: string | undefined,
  pairs: { [key: string]: PairProps },
  setPair: (pair: PairProps | undefined) => void,
  setErrors: (errors: FormErrors) => void,
  setIsApprovedA: (needAllowance: boolean) => void,
  setIsApprovedB: (needAllowance: boolean) => void,
  setButtonState: (needAllowance: provideButtonState) => void,
): Promise<void> => {
  if (!client || !address || !values.selectFrom || !values.selectTo || !pairs) return;

  if (values.selectFrom.address === values.selectTo.address) {
    console.error("Cannot set the same tokens in swap");
    values.selectTo = undefined;
  }
  if (!values.selectTo) return;

  //CHECK if has pair
  const pair: PairProps | undefined = Pair.getPair(pairs, values.selectFrom.address, values.selectTo.address);
  pair ? setPair(pair) : setPair(undefined);
  pair
    ? setButtonState({ type: "provide", title: "Provide" })
    : setButtonState({ type: "create", title: "Create Pair" });
  if (!pair) return;

  //Check allowance A
  if (values.selectFrom.address !== "utgd") {
    const result = await Contract20WS.getAllowance(
      client,
      values.selectFrom.address,
      address,
      pair.contract_addr,
    );
    const token_allowance = Number(result);
    const assetA = Decimal.fromUserInput(
      values.assetB.toString(),
      values.selectTo.decimals,
    ).toFloatApproximation();
    assetA > token_allowance || token_allowance === 0 ? setIsApprovedA(false) : setIsApprovedA(true);
  } else {
    setIsApprovedA(true);
  }
  //Check allowance B
  if (values.selectTo.address !== "utgd") {
    const result = await Contract20WS.getAllowance(
      client,
      values.selectTo.address,
      address,
      pair.contract_addr,
    );
    const token_allowance = Number(result);
    const assetB = Decimal.fromUserInput(
      values.assetB.toString(),
      values.selectTo.decimals,
    ).toFloatApproximation();
    assetB > token_allowance || token_allowance === 0 ? setIsApprovedB(false) : setIsApprovedB(true);
  } else {
    setIsApprovedB(true);
  }
  const errors: FormErrors = {
    from: undefined,
    to: undefined,
  };
  //Insufficient balance FROM
  values.assetA > parseFloat(values.selectFrom.humanBalance)
    ? (errors.from = "Insufficient Balance")
    : (errors.from = undefined);

  //Insufficient balance TO
  values.assetB > parseFloat(values.selectTo.humanBalance)
    ? (errors.to = "Insufficient Balance")
    : (errors.to = undefined);

  setErrors(errors);
};

export const handleSubmit = async (
  values: ProvideFormValues,
  signingClient: SigningCosmWasmClient | undefined,
  client: CosmWasmClient | undefined,
  address: string | undefined,
  setLoading: any,
  selectedPair: PairProps | undefined,
  config: NetworkConfig,
  simulation: SimulationProvide | undefined,
  setSimulation: (a: SimulationProvide | undefined) => void,
  setDetailProvide: (a: DetailProvide | undefined) => void,
  history: any,
  provideButtonState: provideButtonState,
  setProvideButtonState: (a: provideButtonState) => void,
  factoryAddress: string,
  refreshToken: (token: TokenProps) => void,
  refreshPairs: (pairs: { [k: string]: PairProps }) => void,
  setModalOpen: (b: boolean) => void,
): Promise<void> => {
  switch (provideButtonState.type) {
    case "provide":
      if (
        !values.selectTo ||
        !values.selectFrom ||
        !signingClient ||
        !address ||
        !client ||
        !values.assetA ||
        !selectedPair
      )
        return;
      try {
        setLoading(true);
        const provide_result = await Pool.ProvideLiquidity(
          signingClient,
          selectedPair.contract_addr,
          address,
          values,
        );
        if (simulation) {
          setDetailProvide({
            providedA: `${values.assetA} ${values.selectFrom.symbol}`,
            providedB: `${values.assetB} ${values.selectTo.symbol}`,
            received: `${simulation.spread_amount} ${values.selectTo.symbol}`,
            txHash: provide_result.transactionHash,
            fee: (config.gasPrice / 2).toString(),
          });
        } else {
          //Set initial liquidity
          setDetailProvide({
            providedA: `${values.assetA} ${values.selectFrom.symbol}`,
            providedB: `${values.assetB} ${values.selectTo.symbol}`,
            received: `~`,
            txHash: provide_result.transactionHash,
            fee: (config.gasPrice / 2).toString(),
          });
        }
        setSimulation(undefined);
        //Update balances
        const tokenA = await Contract20WS.getTokenInfo(client, address, values.selectFrom.address, config);
        const tokenB = await Contract20WS.getTokenInfo(client, address, values.selectTo.address, config);
        refreshToken(tokenA);
        refreshToken(tokenB);
        history.push(`${paths.tmarket.prefix}${paths.tmarket.provide.prefix}${paths.tmarket.provide.result}`);
      } catch (e) {
        const error = getErrorFromStackTrace(e.message);
        console.error(error);
        toast.error(error);
        setLoading(false);
      }
      break;
    case "create":
      try {
        if (!signingClient || !address || !client) return;
        setLoading(true);
        const swapValues: SwapFormValues = {
          From: values.assetA,
          To: values.assetB,
          selectFrom: values.selectFrom,
          selectTo: values.selectTo,
        };
        await Factory.createPair(signingClient, address, factoryAddress, swapValues);
        setProvideButtonState({ title: "Provide", type: "provide" });
        const pairs = await Factory.getPairs(client, factoryAddress);
        refreshPairs(pairs);
      } catch (e) {
        const error = getErrorFromStackTrace(e.message);
        console.error(error);
        toast.error(error);
      }
      console.log("creating pair");
      break;
    case "connect_wallet":
      setModalOpen(true);
      break;
    default:
      break;
  }

  setLoading(false);
};
