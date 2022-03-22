import { Row } from "antd";
import ButtonApproved from "App/components/ButtonApproved";
import { useFormikContext } from "formik";
import { useState } from "react";
import { useSdk } from "service";
import { setIsTokenApprovedA, setIsTokenApprovedB, useProvide } from "service/provide";
import { useTokens } from "service/tokens";
import { Contract20WS } from "utils/cw20";
import { ProvideFormValues } from "utils/tokens";

const ApproveTokensRow = (): JSX.Element => {
  const { sdkState } = useSdk();
  const {
    tokensState: { loadToken },
  } = useTokens();
  const { provideState, provideDispatch } = useProvide();
  const { values } = useFormikContext<ProvideFormValues>();
  const { isTokenApprovedA, isTokenApprovedB, selectedPair } = provideState;
  const { signingClient, address } = sdkState;

  const [isApprovingTokenA, setApprovingTokenA] = useState(false);
  const [isApprovingTokenB, setApprovingTokenB] = useState(false);

  if (!selectedPair || !signingClient || !values.selectFrom || !values.selectTo) return <></>;

  const approveTokenA = async (): Promise<void> => {
    if (!values?.selectFrom?.address || !address) return;

    try {
      setApprovingTokenA(true);
      await Contract20WS.Authorized(
        signingClient,
        values.selectFrom.address,
        address,
        selectedPair.contract_addr,
      );
      setIsTokenApprovedA(provideDispatch, true);
    } catch (error) {
      console.error(`Error when approving token ${values.selectFrom?.symbol}`);
      console.error(error);
    } finally {
      await loadToken?.(values.selectFrom.address);
      setApprovingTokenA(false);
    }
  };

  const approveTokenB = async (): Promise<void> => {
    if (!values?.selectTo?.address || !address) return;

    try {
      setApprovingTokenB(true);
      await Contract20WS.Authorized(
        signingClient,
        values.selectTo.address,
        address,
        selectedPair.contract_addr,
      );
      setIsTokenApprovedB(provideDispatch, true);
    } catch (error) {
      console.error(`Error when approving token ${values.selectTo?.symbol}`);
      console.error(error);
    } finally {
      await loadToken?.(values.selectTo.address);
      setApprovingTokenB(false);
    }
  };
  return (
    <Row style={{ margin: 0 }} justify="center">
      {!isTokenApprovedA ? (
        <ButtonApproved loading={isApprovingTokenA} onClick={approveTokenA}>
          Approve {values.selectFrom.symbol}
        </ButtonApproved>
      ) : null}
      {!isTokenApprovedB ? (
        <ButtonApproved loading={isApprovingTokenB} onClick={approveTokenB}>
          Approve {values.selectTo.symbol}
        </ButtonApproved>
      ) : null}
    </Row>
  );
};

export default ApproveTokensRow;
