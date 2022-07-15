import { Typography } from "antd";
import Button from "App/components/Button";
import PageLayout from "App/components/PageLayout";
import ShowTxResult, { TxResult } from "App/components/ShowTxResult";
import Stack from "App/components/Stack/style";
import DelegateContainer from "App/containers/DelegateContainer";
import WithdrawRewardsContainer from "App/containers/WithdrawRewardsContainer";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import { EngagementContract, EngagementContractQuerier } from "utils/poeEngagement";

import { EngagementPageLayout, TextStack } from "./style";

const { Title, Text } = Typography;

export default function Engagement(): JSX.Element | null {
  const {
    sdkState: { config, client, signingClient },
  } = useSdk();

  const [txResult, setTxResult] = useState<TxResult>();
  const [egContract, setEgContract] = useState<EngagementContractQuerier>();

  useEffect(() => {
    if (signingClient) {
      setEgContract(new EngagementContract(config, PoEContractType.ENGAGEMENT, signingClient));
      return;
    }

    if (client) {
      setEgContract(new EngagementContractQuerier(config, PoEContractType.ENGAGEMENT, client));
    }
  }, [client, config, signingClient]);

  return txResult ? (
    <PageLayout maxwidth="75rem">
      <ShowTxResult {...txResult}>
        <Button
          onClick={() => setTxResult(undefined)}
          data-cy="transaction-result-screen-go-to-engagement-button"
        >
          <span>{txResult.error ? "Try again" : "Go to Engagement"}</span>
        </Button>
      </ShowTxResult>
    </PageLayout>
  ) : (
    <EngagementPageLayout maxwidth="75rem" centered="false">
      <Stack gap="s4" style={{ width: "100%" }}>
        <TextStack>
          <Title>Engagement</Title>
          <Text>You can delegate the withdrawal of your funds to another address.</Text>
          <Text>
            You may also check any address' engagement points and rewards, and attempt a reward withdrawal.
            Another address can be set as receiver of the withdrawal.
          </Text>
        </TextStack>
        <DelegateContainer egContract={egContract} setTxResult={setTxResult} />
        <WithdrawRewardsContainer egContract={egContract} setTxResult={setTxResult} />
      </Stack>
    </EngagementPageLayout>
  );
}
