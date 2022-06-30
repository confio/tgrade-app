import { Coin } from "@cosmjs/stargate";
import { Typography } from "antd";
import { TxResult } from "App/components/ShowTxResult";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { getFormItemName, isValidAddress } from "utils/forms";
import { EngagementContract, EngagementContractQuerier, FormattedHalflifeInfo } from "utils/poeEngagement";
import * as Yup from "yup";

import { BoldText, Cell, CheckStack, Row } from "./style";
import WithdrawRewardsForm, {
  FormWithdrawRewardsValues,
  queryAddressLabel,
  receiverAddressLabel,
} from "./WithdrawRewardsForm";

const { Text } = Typography;

interface WithdrawRewardsContainerProps {
  readonly egContract: EngagementContractQuerier | undefined;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
}

export default function WithdrawRewardsContainer({
  egContract,
  setTxResult,
}: WithdrawRewardsContainerProps): JSX.Element | null {
  const {
    sdkState: { config, address },
  } = useSdk();

  const [queryAddress, setQueryAddress] = useState(address || "");
  const [receiverAddress, setReceiverAddress] = useState("");

  const [engagement, setEngagement] = useState(0);
  const [totalEngagement, setTotalEngagement] = useState(0);
  const [withdrawableFunds, setWithdrawableFunds] = useState<Coin>();
  const [halflifeInfo, setHalflifeInfo] = useState<FormattedHalflifeInfo>();

  useEffect(() => {
    (async function updateEngagement() {
      if (!egContract || !queryAddress || !isValidAddress(queryAddress, config.addressPrefix)) return;

      const engagement = await egContract.getEngagementPoints(queryAddress);
      setEngagement(engagement);
    })();
  }, [config.addressPrefix, egContract, queryAddress]);

  useEffect(() => {
    (async function updateTotalEngagement() {
      if (!egContract) return;

      const totalEngagement = await egContract.getTotalEngagementPoints();
      setTotalEngagement(totalEngagement);
    })();
  }, [egContract]);

  useEffect(() => {
    (async function updateWithdrawableFunds() {
      if (!egContract || !queryAddress || !isValidAddress(queryAddress, config.addressPrefix)) return;

      const withdrawableFunds = await egContract.getWithdrawableRewards(queryAddress);
      const displayWithdrawableFunds = nativeCoinToDisplay(withdrawableFunds, config.coinMap);
      setWithdrawableFunds(displayWithdrawableFunds);
    })();
  }, [config.addressPrefix, config.coinMap, egContract, queryAddress]);

  useEffect(() => {
    (async function updateHalflifeInfo() {
      if (!egContract) return;

      const halflifeInfo = await egContract.getFormattedHalflifeInfo();
      setHalflifeInfo(halflifeInfo);
    })();
  }, [egContract]);

  const withdrawValidationSchema = Yup.object().shape({
    [getFormItemName(queryAddressLabel)]: Yup.string()
      .typeError("Query address must be alphanumeric")
      .required("Query address is required")
      .test(
        "is-address-valid",
        "Query address must be valid",
        (queryAddress) => !queryAddress || isValidAddress(queryAddress, config.addressPrefix),
      ),
    [getFormItemName(receiverAddressLabel)]: Yup.string()
      .typeError("Receiver address must be alphanumeric")
      .test(
        "is-address-valid",
        "Receiver address must be valid",
        (receiverAddress) => !receiverAddress || isValidAddress(receiverAddress, config.addressPrefix),
      ),
  });

  async function submitWithdrawRewards({ queryAddress, receiverAddress }: FormWithdrawRewardsValues) {
    if (!address || !(egContract instanceof EngagementContract)) return;

    try {
      const txHash = await egContract.withdrawRewards(address, queryAddress, receiverAddress || undefined);
      setTxResult({
        msg: `Rewards from ${queryAddress} withdrawn to ${
          receiverAddress || address
        }. Transaction ID: ${txHash}`,
      });
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
    }
  }

  return (
    <CheckStack>
      <BoldText>Check engagement</BoldText>
      <WithdrawRewardsForm
        canWithdraw={withdrawableFunds?.amount !== "0"}
        address={address}
        queryAddress={queryAddress}
        setQueryAddress={setQueryAddress}
        receiverAddress={receiverAddress}
        setReceiverAddress={setReceiverAddress}
        withdrawValidationSchema={withdrawValidationSchema}
        submitWithdrawRewards={submitWithdrawRewards}
      >
        <Row>
          <Cell>
            <Text>Engagement points</Text>
            <Text>
              <BoldText>{engagement} / </BoldText>
              {totalEngagement} ({((engagement / totalEngagement) * 100).toFixed(2)}%)
            </Text>
          </Cell>
          <Cell>
            <Text>Engagement rewards</Text>
            <Text>
              {withdrawableFunds?.amount || "—"} {withdrawableFunds?.denom || ""}
            </Text>
          </Cell>
        </Row>
        {halflifeInfo ? (
          <Row>
            <Cell>
              <Text>Last half-life event</Text>
              <BoldText>{`${halflifeInfo?.lastHalflifeDate.toLocaleDateString()} ${halflifeInfo?.lastHalflifeDate.toLocaleTimeString()}`}</BoldText>
            </Cell>
            <Cell>
              <Text>Next half-life event</Text>
              <BoldText>{`${halflifeInfo?.nextHalflifeDate.toLocaleDateString()} ${halflifeInfo?.nextHalflifeDate.toLocaleTimeString()}`}</BoldText>
            </Cell>
          </Row>
        ) : null}
      </WithdrawRewardsForm>
    </CheckStack>
  );
}
