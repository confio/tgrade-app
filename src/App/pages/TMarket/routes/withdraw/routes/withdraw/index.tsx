import * as React from "react";
import { Formik } from "formik";
import {
  SubmitButton,
  ExitIcon,
  MiddleRow,
  MenuAMM,
  EstimatedMessage,
  ArrowIcon,
} from "App/routes/TMarket/components";
import { Divider } from "antd";
import { FormCustom, CardCustom } from "./style";
import { DetailWithdraw, LPToken, WithdrawFormValues } from "utils/tokens";
import { FromToken, ToToken } from "../../components/";
import { handleSubmit } from "../../utils/form";
import { useSdk } from "service";
import { updateLPToken, useTMarket } from "service/tmarket";
import { useWithdraw, setLoading, setDetailWithdraw, setWithdrawButtonState } from "service/withdraw";
import ExtraInfo from "../../components/ExtraInfo";
import { useHistory } from "react-router-dom";
import ConnectWalletModal from "App/components/logic/NavSidebar/components/ConnectWalletModal";

const initialValues: WithdrawFormValues = {
  To: "0 - 0",
  From: 0.0,
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
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
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
