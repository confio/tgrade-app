import * as React from "react";
import { Formik } from "formik";
import { DetailProvide, PairProps, ProvideFormValues, SimulationProvide, TokenProps } from "utils/tokens";
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
import {
  MenuAMM,
  ExitIcon,
  PlusIcon,
  EstimatedMessage,
  SubmitButton,
  MiddleRow,
} from "App/pages/TMarket/components";
import { ToToken, FromToken, ApproveTokensRow, ExtraInfo, Tip, EmptyPoolTip } from "../../components";
import { handleSubmit, handleValidation } from "../../utils/form";
import { Divider } from "antd";
import { FormCustom } from "./style";
import { useSdk } from "service";
import { CardCustom } from "App/pages/TMarket/style";
import { updatePairs, updateToken, useTMarket } from "service/tmarket";
import { useHistory } from "react-router-dom";
import ConnectWalletModal from "App/components/ConnectWalletModal";

const initialValues: ProvideFormValues = {
  assetA: 0.0,
  assetB: 0.0,
  selectFrom: undefined,
  selectTo: undefined,
};

export default function Provide(): JSX.Element {
  const { provideDispatch, provideState } = useProvide();
  const { sdkState } = useSdk();
  const history = useHistory();
  const { tMarketState, tMarketDispatch } = useTMarket();
  const { pairs } = tMarketState;
  const { address, signingClient, client, config } = sdkState;
  const {
    errors,
    selectedPair,
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
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!address) {
      setProvideButton({ title: "Connect Wallet", type: "connect_wallet" });
    } else {
      setProvideButton({ title: "Provide", type: "provide" });
    }
    //eslint-disable-next-line
  }, [address]);

  return (
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
          tMarketState.factoryAddress,
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
          <Tip />
          <FromToken />
          <MiddleRow>
            <PlusIcon />
          </MiddleRow>
          <ToToken />
          <Divider />
          <EmptyPoolTip />
          <ExtraInfo />
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
  );
}
