import { Row, Typography } from "antd";
import ButtonApproved from "App/components/ButtonApproved";
import { useFormikContext } from "formik";
import { useState } from "react";
import { useSdk } from "service";
import { setIsTokenApprovedA, setIsTokenApprovedB, useProvide } from "service/provide";
import { useTokens } from "service/tokens";
import { Contract20WS } from "utils/cw20";
import { ProvideFormValues } from "utils/tokens";

const { Paragraph } = Typography;

const ApproveTokensRow = (): JSX.Element | null => {
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

  const approveTokenA = async (): Promise<void> => {
    if (!values?.selectFrom?.address || !signingClient || !selectedPair || !address) return;

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
      console.error(`Error when approving token ${values.selectFrom.symbol}`);
      console.error(error);
    } finally {
      await loadToken?.(values.selectFrom.address);
      setApprovingTokenA(false);
    }
  };

  const approveTokenB = async (): Promise<void> => {
    if (!values?.selectTo?.address || !signingClient || !selectedPair || !address) return;

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
      console.error(`Error when approving token ${values.selectTo.symbol}`);
      console.error(error);
    } finally {
      await loadToken?.(values.selectTo.address);
      setApprovingTokenB(false);
    }
  };

  const someTokenNotApproved = !isTokenApprovedA || !isTokenApprovedB;
  const showRow = selectedPair && values.selectFrom && values.selectTo && someTokenNotApproved;

  return showRow ? (
    <Row style={{ margin: 0 }}>
      <Paragraph style={{ marginBottom: "var(--s-2)", fontSize: "var(--s-1)" }}>
        The following tokens need to be approved before being able to trade with the pair:
      </Paragraph>
      {!isTokenApprovedA ? (
        <ButtonApproved loading={isApprovingTokenA} onClick={approveTokenA}>
          Approve {values.selectFrom?.symbol}
        </ButtonApproved>
      ) : null}
      {!isTokenApprovedB ? (
        <ButtonApproved loading={isApprovingTokenB} onClick={approveTokenB}>
          Approve {values.selectTo?.symbol}
        </ButtonApproved>
      ) : null}
    </Row>
  ) : null;
};

export default ApproveTokensRow;
