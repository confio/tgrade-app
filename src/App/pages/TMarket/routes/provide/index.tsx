import { calculateFee } from "@cosmjs/stargate";
import { Divider } from "antd";
import {
  EstimatedMessage,
  ExitIcon,
  MenuAMM,
  MiddleRow,
  PlusIcon,
  SubmitButton,
} from "App/pages/TMarket/components";
import { CardCustom } from "App/pages/TMarket/style";
import { Formik } from "formik";
import { lazy, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSdk } from "service";
import {
  FormErrors,
  provideButtonState,
  setDetailProvide,
  setErrors,
  setIsTokenApprovedA,
  setIsTokenApprovedB,
  setLoading,
  setprovideButtonState,
  setSelectedPair,
  setSimulationProvide,
  useProvide,
} from "service/provide";
import { updatePairs, updateToken, useTMarket } from "service/tmarket";
import {
  DetailProvide,
  PairProps,
  ProvideFormValues,
  SimulationProvide,
  Token,
  TokenProps,
} from "utils/tokens";

import { ApproveTokensRow, EmptyPoolTip, ExtraInfo, FromToken, ToToken } from "./components";
import ProvideResultModal from "./components/ProvideResultModal";
import { FormCustom } from "./style";
import { handleSubmit, handleValidation } from "./utils/form";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));

const initialValues: ProvideFormValues = {
  assetA: 1.0,
  assetB: 1.0,
  selectFrom: undefined,
  selectTo: undefined,
};

export default function Provide(): JSX.Element {
  const { provideDispatch, provideState } = useProvide();
  const {
    sdkState: { config, client, address, signingClient },
  } = useSdk();
  const history = useHistory();
  const { tMarketState, tMarketDispatch } = useTMarket();
  const { pairs } = tMarketState;
  const {
    errors,
    selectedPair,
    detailProvide,
    simulationProvide,
    loading,
    isTokenApprovedA,
    isTokenApprovedB,
    provideButtonState,
  } = provideState;

  const setLoadingButton = (loading: boolean) => setLoading(provideDispatch, loading);
  const setPair = (pair: PairProps | undefined) => setSelectedPair(provideDispatch, pair);
  const setSimulation = (s: SimulationProvide | undefined) => setSimulationProvide(provideDispatch, s);
  const setNewError = (e: FormErrors) => setErrors(provideDispatch, e);
  const setDetail = (detail: DetailProvide | undefined) => setDetailProvide(provideDispatch, detail);
  const setIsApproveA = (needAllowance: boolean) => setIsTokenApprovedA(provideDispatch, needAllowance);
  const setIsApproveB = (needAllowance: boolean) => setIsTokenApprovedB(provideDispatch, needAllowance);
  const setProvideButton = (state: provideButtonState) => setprovideButtonState(provideDispatch, state);
  const refreshToken = (token: TokenProps) => updateToken(tMarketDispatch, { [token.address]: token });
  const refreshPairs = (p: { [k: string]: PairProps }) => updatePairs(tMarketDispatch, p);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!address) {
      setProvideButton({ title: "Connect Wallet", type: "connect_wallet" });
    } else {
      setProvideButton({ title: "Provide", type: "provide" });
    }
    //eslint-disable-next-line
  }, [address]);

  return (
    <>
      <Formik
        validate={async (values: ProvideFormValues) => {
          await handleValidation(
            values,
            client,
            address,
            pairs,
            setPair,
            setNewError,
            setIsApproveA,
            setIsApproveB,
            setProvideButton,
          );
        }}
        onSubmit={async (values: ProvideFormValues) =>
          await handleSubmit(
            values,
            signingClient,
            client,
            address,
            setLoadingButton,
            selectedPair,
            config,
            simulationProvide,
            setSimulation,
            setDetail,
            history,
            provideButtonState,
            setProvideButton,
            config.factoryAddress,
            refreshToken,
            refreshPairs,
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
              <PlusIcon />
            </MiddleRow>
            <ToToken />
            <Divider />
            <EmptyPoolTip />
            <ExtraInfo fee={calculateFee(Token.GAS_PROVIDE_LIQUIDITY, config.gasPrice)} />
            <ApproveTokensRow />
            <EstimatedMessage />
            <SubmitButton
              disabled={
                (!isTokenApprovedA || !isTokenApprovedB || errors.from !== undefined) &&
                selectedPair !== undefined
              }
              loading={loading}
              title={provideButtonState.title}
            />
          </FormCustom>
          <ConnectWalletModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
          <ExitIcon />
        </CardCustom>
      </Formik>
      <ProvideResultModal isModalOpen={!!detailProvide} />
    </>
  );
}
