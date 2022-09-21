import { CosmWasmClient, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Decimal } from "@cosmjs/math";
import { paths } from "App/paths";
import { NetworkConfig } from "config/network";
import { toast } from "react-toastify";
import { FormErrors, provideButtonState } from "service/provide";
import { gtagTMarketAction, gtagTokenAction } from "utils/analytics";
import { Contract20WS } from "utils/cw20";
import { getErrorFromStackTrace } from "utils/errors";
import { Factory } from "utils/factory";
import {
  DetailProvide,
  Pair,
  PoolContract,
  ProvideFormValues,
  SimulationProvide,
  SwapFormValues,
} from "utils/tokens";

export const handleValidation = async (
  values: ProvideFormValues,
  client: CosmWasmClient | undefined,
  address: string | undefined,
  factoryAddress: string,
  setPair: (pair: Pair | undefined) => void,
  setErrors: (errors: FormErrors) => void,
  setIsApprovedA: (needAllowance: boolean) => void,
  setIsApprovedB: (needAllowance: boolean) => void,
  setButtonState: (needAllowance: provideButtonState) => void,
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
  pair ? setPair(pair) : setPair(undefined);
  pair
    ? setButtonState({ type: "provide", title: "Provide" })
    : setButtonState({ type: "create", title: "Create Pair" });
  if (!pair) return;

  //Check allowance A
  if (values.selectFrom.address !== "utgd") {
    const allowanceAmount = await Contract20WS.getAllowance(
      client,
      values.selectFrom.address,
      address,
      pair.contract_addr,
    );

    if (allowanceAmount === "0") {
      setIsApprovedA(false);
    } else {
      const tokenAmountA = Decimal.fromUserInput(
        values.assetA.toString(),
        values.selectFrom.decimals,
      ).toFloatApproximation();

      if (tokenAmountA > Number(allowanceAmount)) {
        setIsApprovedA(false);
      } else {
        setIsApprovedA(true);
      }
    }
  } else {
    setIsApprovedA(true);
  }

  //Check allowance B
  if (values.selectTo.address !== "utgd") {
    const allowanceAmount = await Contract20WS.getAllowance(
      client,
      values.selectTo.address,
      address,
      pair.contract_addr,
    );

    if (allowanceAmount === "0") {
      setIsApprovedB(false);
    } else {
      const tokenAmountB = Decimal.fromUserInput(
        values.assetB.toString(),
        values.selectTo.decimals,
      ).toFloatApproximation();

      if (tokenAmountB > Number(allowanceAmount)) {
        setIsApprovedB(false);
      } else {
        setIsApprovedB(true);
      }
    }
  } else {
    setIsApprovedB(true);
  }

  const errors: FormErrors = {
    from: undefined,
    to: undefined,
  };

  //Insufficient balance FROM
  if (Number(values.assetA) > Number(values.selectFrom.humanBalance)) {
    errors.from = "Insufficient Balance";
  }

  //Insufficient balance TO
  if (Number(values.assetB) > Number(values.selectTo.humanBalance)) {
    errors.to = "Insufficient Balance";
  }

  //Insufficient provide FROM
  if (Number(values.assetA) < 0) {
    errors.from = "Must provide some liquidity";
  }

  //Insufficient provide TO
  if (Number(values.assetB) < 0) {
    errors.to = "Must provide some liquidity";
  }

  setErrors(errors);
};

export const handleSubmit = async (
  values: ProvideFormValues,
  signingClient: SigningCosmWasmClient | undefined,
  client: CosmWasmClient | undefined,
  address: string | undefined,
  setLoading: any,
  selectedPair: Pair | undefined,
  config: NetworkConfig,
  simulation: SimulationProvide | undefined,
  setSimulation: (a: SimulationProvide | undefined) => void,
  setDetailProvide: (a: DetailProvide | undefined) => void,
  history: any,
  provideButtonState: provideButtonState,
  setProvideButtonState: (a: provideButtonState) => void,
  factoryAddress: string,
  setModalOpen: (b: boolean) => void,
): Promise<void> => {
  switch (provideButtonState.type) {
    case "provide":
      gtagTMarketAction("provide_try");
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
        const txHash = await PoolContract.ProvideLiquidity(
          signingClient,
          selectedPair.contract_addr,
          address,
          values,
          config.gasPrice,
        );
        gtagTMarketAction("provide_success");

        if (simulation) {
          setDetailProvide({
            providedA: `${values.assetA} ${values.selectFrom.symbol}`,
            providedB: `${values.assetB} ${values.selectTo.symbol}`,
            received: `${simulation.spread_amount} ${values.selectTo.symbol}`,
            txHash: txHash ?? "",
            fee: (Number(config.gasPrice.amount) / 2).toString(),
          });
        } else {
          //Set initial liquidity
          setDetailProvide({
            providedA: `${values.assetA} ${values.selectFrom.symbol}`,
            providedB: `${values.assetB} ${values.selectTo.symbol}`,
            received: `~`,
            txHash: txHash ?? "",
            fee: (Number(config.gasPrice.amount) / 2).toString(),
          });
        }
        setSimulation(undefined);
        history.push(`${paths.tmarket.prefix}${paths.tmarket.provide.prefix}${paths.tmarket.provide.result}`);
      } catch (e) {
        if (!(e instanceof Error)) return;
        const error = getErrorFromStackTrace(e);
        console.error(error);
        toast.error(error, { toastId: "t-market-toast-id" });
        setLoading(false);
      }
      break;
    case "create":
      try {
        gtagTokenAction("create_pair_try");
        if (!signingClient || !address || !client) return;
        setLoading(true);
        const swapValues: SwapFormValues = {
          From: "", // unneeded for create pair
          To: "", // unneeded for create pair
          selectFrom: values.selectFrom,
          selectTo: values.selectTo,
        };
        await Factory.createPair(signingClient, address, factoryAddress, swapValues, config.gasPrice);
        gtagTokenAction("create_pair_success");
        setProvideButtonState({ title: "Provide", type: "provide" });
      } catch (e) {
        if (!(e instanceof Error)) return;
        const error = getErrorFromStackTrace(e);
        console.error(error);
        toast.error(error, { toastId: "t-market-toast-id" });
      }
      break;
    case "connect_wallet":
      setModalOpen(true);
      break;
    default:
      break;
  }

  setLoading(false);
};
