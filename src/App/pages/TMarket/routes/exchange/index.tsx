import { calculateFee } from "@cosmjs/stargate";
import { Divider } from "antd";
import {
  EstimatedMessage,
  MenuAMM,
  MiddleRow,
  SubmitButton,
  SwitchTokensButton,
} from "App/pages/TMarket/components";
import { CardCustom } from "App/pages/TMarket/style";
import { Formik } from "formik";
import { lazy, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSdk } from "service";
import {
  FormErrors,
  setDetailSwap,
  setErrors,
  setLoading,
  setSelectedPair,
  setSimulatedSwap,
  setSwapButton,
  SwapButtonState,
  useExchange,
} from "service/exchange";
import { useTokens } from "service/tokens";
import { DetailSwap, Pair, SimulatedSwap, SwapFormValues, TokenContract } from "utils/tokens";

import { ExtraInfo, FromToken, ToToken } from "./components";
import ExchangeResultModal from "./components/ExchangeResultModal";
import { FormCustom } from "./style";
import { handleSubmit, handleValidation } from "./utils/form";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));

const initialValues: SwapFormValues = { To: "", From: "", selectFrom: undefined, selectTo: undefined };

export default function Exchange(): JSX.Element {
  const { sdkState } = useSdk();
  const {
    tokensState: { loadToken },
  } = useTokens();
  const { exchangeState, exchangeDispatch } = useExchange();
  const { address, signingClient, client, config } = sdkState;
  const { loading, detailSwap, swapButton, selectedPair, simulatedSwap, errors } = exchangeState;

  const setLoadingButton = (loading: boolean) => setLoading(exchangeDispatch, loading);
  const setSwapButtonState = (button: SwapButtonState) => setSwapButton(exchangeDispatch, button);
  const setPair = (pair: Pair | undefined) => setSelectedPair(exchangeDispatch, pair);
  const setSimulation = (simulation: SimulatedSwap | undefined) =>
    setSimulatedSwap(exchangeDispatch, simulation);
  const setDetail = (detail: DetailSwap | undefined) => setDetailSwap(exchangeDispatch, detail);
  const setNewError = (error: FormErrors) => setErrors(exchangeDispatch, error);
  const history = useHistory();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!address) {
      setSwapButtonState({ title: "Connect Wallet", type: "connect_wallet" });
    } else {
      setSwapButtonState({ title: "Swap", type: "swap" });
    }
    //eslint-disable-next-line
  }, [address]);
  return (
    <>
      <Formik
        validate={async (values: SwapFormValues) => {
          await handleValidation(
            values,
            client,
            address,
            swapButton,
            config.factoryAddress,
            setPair,
            setSwapButtonState,
            setNewError,
          );
        }}
        onSubmit={async (values: SwapFormValues, { setFieldValue }) => {
          await handleSubmit(
            values,
            signingClient,
            client,
            address,
            setLoadingButton,
            selectedPair,
            config,
            simulatedSwap,
            setSimulation,
            setDetail,
            history,
            setModalOpen,
          );

          setFieldValue("From", "");
          setFieldValue("To", "");

          if (values.selectFrom?.address) {
            await loadToken?.(values.selectFrom.address);
          }
          if (values.selectTo?.address) {
            await loadToken?.(values.selectTo.address);
          }
        }}
        initialValues={initialValues}
      >
        <CardCustom>
          <MenuAMM />
          <FormCustom>
            <FromToken />
            <MiddleRow>
              <SwitchTokensButton />
            </MiddleRow>
            <ToToken />
            <Divider />
            <ExtraInfo fee={calculateFee(TokenContract.GAS_SWAP, sdkState.config.gasPrice)} />
            <EstimatedMessage />
            <SubmitButton
              disabled={
                swapButton.type === "not_exits" ||
                swapButton.type === "no_liquidity" ||
                errors.from !== undefined ||
                errors.to !== undefined
              }
              loading={loading}
              title={swapButton.title}
            />
          </FormCustom>
          <ConnectWalletModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
        </CardCustom>
      </Formik>
      <ExchangeResultModal isModalOpen={!!detailSwap} />
    </>
  );
}
