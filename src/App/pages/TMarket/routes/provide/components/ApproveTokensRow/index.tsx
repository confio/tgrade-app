import { Row } from "antd";
import ButtonApproved from "App/components/ButtonApproved";
import { useFormikContext } from "formik";
import { useState } from "react";
import { useSdk } from "service";
import { setIsTokenApprovedA, setIsTokenApprovedB, useProvide } from "service/provide";
import { Contract20WS } from "utils/cw20";
import { ProvideFormValues } from "utils/tokens";

const ApproveTokensRow = (): JSX.Element => {
  const { sdkState } = useSdk();
  const { provideState, provideDispatch } = useProvide();
  const { values } = useFormikContext<ProvideFormValues>();
  const { isTokenApprovedA, isTokenApprovedB, selectedPair } = provideState;
  const { signingClient, address } = sdkState;

  const [isApprovingTokenA, setApprovingTokenA] = useState(false);
  const [isApprovingTokenB, setApprovingTokenB] = useState(false);

  if (!selectedPair || !signingClient || !values.selectFrom || !values.selectTo) return <></>;

  const approveTokenA = async (): Promise<void> => {
    try {
      if (!values?.selectFrom?.address || !address) return;

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
      setApprovingTokenA(false);
    }
  };

  const approveTokenB = async (): Promise<void> => {
    try {
      if (!values?.selectTo?.address || !address) return;

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
