import { Divider } from "antd";
import {
  ArrowIcon,
  EstimatedMessage,
  ExitIcon,
  MenuAMM,
  MiddleRow,
  SubmitButton,
} from "App/pages/TMarket/components";
import { Formik } from "formik";
import { lazy, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSdk } from "service";
import { updateLPToken, useTMarket } from "service/tmarket";
import { setDetailWithdraw, setLoading, setWithdrawButtonState, useWithdraw } from "service/withdraw";
import { DetailWithdraw, LPToken, WithdrawFormValues } from "utils/tokens";
import { FromToken, ToToken } from "../../components/";
import ExtraInfo from "../../components/ExtraInfo";
import { handleSubmit } from "../../utils/form";
import { CardCustom, FormCustom } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));

const initialValues: WithdrawFormValues = {
  To: "0 - 0",
  From: 1.0,
  selectFrom: undefined,
  selectTo: undefined,
};

export default function Withdraw(): JSX.Element {
  const { sdkState } = useSdk();
  const { tMarketDispatch } = useTMarket();
  const { withdrawState, withdrawDispatch } = useWithdraw();
  const history = useHistory();
  const { loading, selected, errors, detail, buttonState } = withdrawState;
  const { address, signingClient, config, client } = sdkState;
  const setLoadingButton = (l: boolean) => setLoading(withdrawDispatch, l);
  const setDetail = (e: DetailWithdraw) => setDetailWithdraw(withdrawDispatch, e);
  const updateLP = (e: { [key: string]: LPToken }) => updateLPToken(tMarketDispatch, e);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!address) {
      setWithdrawButtonState(withdrawDispatch, { title: "Connect Wallet", type: "connect_wallet" });
    } else {
      setWithdrawButtonState(withdrawDispatch, { title: "Confirm", type: "confirm" });
    }
    //eslint-disable-next-line
  }, [address]);
  return (
    <Formik
      onSubmit={(values) =>
        handleSubmit(
          values,
          client,
          signingClient,
          address,
          config,
          selected,
          detail,
          setLoadingButton,
          setDetail,
          updateLP,
          history,
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
            <ArrowIcon />
          </MiddleRow>
          <ToToken />
          <Divider />
          <ExtraInfo />
          <EstimatedMessage />
          <SubmitButton
            disabled={errors.to !== undefined || errors.from !== undefined}
            loading={loading}
            title={buttonState.title}
          />
        </FormCustom>
        <ConnectWalletModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
        <ExitIcon />
      </CardCustom>
    </Formik>
  );
}
