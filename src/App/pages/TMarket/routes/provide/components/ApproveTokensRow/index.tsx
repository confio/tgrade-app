import { Row } from "antd";
import ButtonApproved from "App/components/ButtonApproved";
import { useFormikContext } from "formik";
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
  if (!selectedPair || !signingClient || !values.selectFrom || !values.selectTo) return <></>;

  const approveTokenA = async (): Promise<void> => {
    try {
      if (!values?.selectFrom?.address || !address) return;
      const result = await Contract20WS.Authorized(
        signingClient,
        values.selectFrom.address,
        address,
        selectedPair.contract_addr,
        sdkState.config.gasPrice,
      );
      setIsTokenApprovedA(provideDispatch, true);
      console.log(result);
    } catch (error) {
      console.error(`Error when approving token ${values.selectFrom?.symbol}`);
      console.error(error);
    }
  };

  const approveTokenB = async (): Promise<void> => {
    try {
      if (!values?.selectTo?.address || !address) return;
      const result = await Contract20WS.Authorized(
        signingClient,
        values.selectTo.address,
        address,
        selectedPair.contract_addr,
        sdkState.config.gasPrice,
      );
      setIsTokenApprovedB(provideDispatch, true);
      console.log(result);
    } catch (error) {
      console.error(`Error when approving token ${values.selectTo?.symbol}`);
      console.error(error);
    }
  };
  return (
    <Row style={{ margin: 0 }} justify="center">
      {!isTokenApprovedA ? (
        <ButtonApproved onClick={approveTokenA}>Approve {values.selectFrom.symbol}</ButtonApproved>
      ) : null}
      {!isTokenApprovedB ? (
        <ButtonApproved onClick={approveTokenB}>Approve {values.selectTo.symbol}</ButtonApproved>
      ) : null}
    </Row>
  );
};

export default ApproveTokensRow;
