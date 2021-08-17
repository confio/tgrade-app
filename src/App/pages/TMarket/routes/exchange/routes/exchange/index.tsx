import * as React from "react";
import { Formik } from "formik";
import { ToToken, FromToken, ExtraInfo } from "../../components/";
import { DetailSwap, PairProps, SimulatedSwap, SwapFormValues, TokenProps } from "utils/tokens";
import {
  SubmitButton,
  MenuAMM,
  ExitIcon,
  EstimatedMessage,
  MiddleRow,
  SwitchTokensButton,
} from "App/pages/TMarket/components";
import { Divider } from "antd";
import { FormCustom } from "./style";
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
} from "service/exchange";
import { handleSubmit, handleValidation } from "../../utils/form";
import { CardCustom } from "App/pages/TMarket/style";
import { useHistory } from "react-router-dom";
import { useExchange } from "service/exchange";
import { updateToken, useTMarket } from "service/tmarket";
import ConnectWalletModal from "App/components/ConnectWalletModal";

const initialValues: SwapFormValues = { To: 0.0, From: 0.0, selectFrom: undefined, selectTo: undefined };

export default function Exchange(): JSX.Element {
  const { sdkState } = useSdk();
  const { exchangeState, exchangeDispatch } = useExchange();
  const { tMarketState, tMarketDispatch } = useTMarket();
  const { pairs } = tMarketState;
  const { address, signingClient, client, config } = sdkState;
  const { loading, swapButton, selectedPair, simulatedSwap, errors } = exchangeState;

  const setLoadingButton = (loading: boolean) => setLoading(exchangeDispatch, loading);
  const setSwapButtonState = (button: SwapButtonState) => setSwapButton(exchangeDispatch, button);
  const setPair = (pair: PairProps | undefined) => setSelectedPair(exchangeDispatch, pair);
  const setSimulation = (simulation: SimulatedSwap | undefined) =>
    setSimulatedSwap(exchangeDispatch, simulation);
  const setDetail = (detail: DetailSwap | undefined) => setDetailSwap(exchangeDispatch, detail);
  const setNewError = (error: FormErrors) => setErrors(exchangeDispatch, error);
  const refreshToken = (t: TokenProps) => updateToken(tMarketDispatch, { [t.address]: t });
  const history = useHistory();
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!address) {
      setSwapButtonState({ title: "Connect Wallet", type: "connect_wallet" });
    } else {
      setSwapButtonState({ title: "Swap", type: "swap" });
    }
    //eslint-disable-next-line
  }, [address]);
  return (
    <Formik
      validate={async (values: SwapFormValues) => {
        await handleValidation(
          values,
          client,
          address,
          swapButton,
          pairs,
          setPair,
          setSwapButtonState,
          setNewError,
        );
      }}
      onSubmit={async (values: SwapFormValues) =>
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
          refreshToken,
          setModalOpen,
        )
      }
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
          <ExtraInfo />
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
        <ExitIcon />
      </CardCustom>
    </Formik>
  );
}
