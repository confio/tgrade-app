import { calculateFee } from "@cosmjs/stargate";
import { Divider } from "antd";
import {
  ArrowIcon,
  EstimatedMessage,
  ExitIcon,
  MenuAMM,
  MiddleRow,
  SubmitButton,
} from "App/pages/TMarket/components";
import { paths } from "App/paths";
import { Formik } from "formik";
import { lazy, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSdk } from "service";
import { useTokens } from "service/tokens";
import { setDetailWithdraw, setLoading, setWithdrawButtonState, useWithdraw } from "service/withdraw";
import { DetailWithdraw, Token, WithdrawFormValues } from "utils/tokens";

import { FromToken, ToToken } from "./components";
import ExtraInfo from "./components/ExtraInfo";
import WithdrawResultModal from "./components/WithdrawResultModal";
import { CardCustom, FormCustom } from "./style";
import { handleSubmit } from "./utils/form";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));

const initialValues: WithdrawFormValues = {
  To: "0 - 0",
  From: "",
  selectFrom: undefined,
  selectTo: undefined,
};

export default function Withdraw(): JSX.Element {
  const { path } = useRouteMatch();
  const { sdkState } = useSdk();
  const {
    tokensState: { loadToken },
  } = useTokens();
  const { withdrawState, withdrawDispatch } = useWithdraw();
  const history = useHistory();
  const { loading, selected, errors, detail, buttonState } = withdrawState;
  const { address, signingClient, config, client } = sdkState;
  const setLoadingButton = (l: boolean) => setLoading(withdrawDispatch, l);
  const setDetail = (e: DetailWithdraw) => setDetailWithdraw(withdrawDispatch, e);
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
    <>
      <Formik
        onSubmit={async (values, { setFieldValue }) => {
          await handleSubmit(
            values,
            client,
            signingClient,
            address,
            config,
            selected,
            detail,
            setLoadingButton,
            setDetail,
            history,
            setModalOpen,
          );

          setFieldValue("From", "");
          setFieldValue("To", "0 - 0");

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
              <ArrowIcon />
            </MiddleRow>
            <ToToken />
            <Divider />
            <ExtraInfo fee={calculateFee(Token.GAS_WITHDRAW_LIQUIDITY, config.gasPrice)} />
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
      <WithdrawResultModal isModalOpen={path.endsWith(paths.tmarket.withdraw.result)} />
    </>
  );
}
