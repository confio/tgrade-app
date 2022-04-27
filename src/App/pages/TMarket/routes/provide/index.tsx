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
import { useTokens } from "service/tokens";
import { Factory } from "utils/factory";
import {
  DetailProvide,
  PairProps,
  ProvideFormValues,
  SimulationProvide,
  Token,
  tokenObj,
} from "utils/tokens";

import { ApproveTokensRow, EmptyPoolTip, ExtraInfo, FromToken, ToToken } from "./components";
import ProvideResultModal from "./components/ProvideResultModal";
import { FormCustom } from "./style";
import { handleSubmit, handleValidation } from "./utils/form";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));

const initialValues: ProvideFormValues = {
  assetA: "",
  assetB: "",
  selectFrom: undefined,
  selectTo: undefined,
};

export default function Provide(): JSX.Element {
  const { provideDispatch, provideState } = useProvide();
  const {
    sdkState: { config, client, address, signingClient },
  } = useSdk();
  const {
    tokensState: { loadToken, loadPair },
  } = useTokens();
  const history = useHistory();
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
            config.factoryAddress,
            setPair,
            setNewError,
            setIsApproveA,
            setIsApproveB,
            setProvideButton,
          );
        }}
        onSubmit={async (values: ProvideFormValues, { setFieldValue, validateForm }) => {
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
            setModalOpen,
          );

          // This makes "Approve token" button appear right after creating a pair
          if (provideButtonState.type === "create") {
            await validateForm();
          }

          if (provideButtonState.type === "provide") {
            setFieldValue("assetA", "");
            setFieldValue("assetB", "");
          }

          if (!values.selectFrom || !values.selectTo) return;

          // Update tokens related to the created/provided pair
          await loadToken?.(values.selectFrom.address);
          await loadToken?.(values.selectTo.address);

          // Update pair
          if (!client) return;

          const assetA: tokenObj =
            values.selectFrom.address === config.feeToken
              ? { native: values.selectFrom.address }
              : { token: values.selectFrom.address };
          const assetB: tokenObj =
            values.selectTo.address === config.feeToken
              ? { native: values.selectTo.address }
              : { token: values.selectTo.address };

          const pair = await Factory.getPair(client, config.factoryAddress, [assetA, assetB]);
          if (pair) {
            await loadPair?.(pair.contract_addr);
          }
        }}
        initialValues={initialValues}
      >
        {({ values }) => (
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
                  (!values.assetA ||
                    values.assetA === "0" ||
                    !values.assetB ||
                    values.assetB === "0" ||
                    !isTokenApprovedA ||
                    !isTokenApprovedB ||
                    !!errors.from ||
                    !!errors.to) &&
                  selectedPair !== undefined
                }
                loading={loading}
                title={provideButtonState.title}
              />
            </FormCustom>
            <ConnectWalletModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
            <ExitIcon />
          </CardCustom>
        )}
      </Formik>
      <ProvideResultModal isModalOpen={!!detailProvide} />
    </>
  );
}
