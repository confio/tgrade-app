import { Typography } from "antd";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { EngagementContractQuerier, FormattedHalflifeInfo } from "utils/poeEngagement";

import { EgDataStack, EngagementStack } from "./style";

const { Title, Text } = Typography;

export default function OcEngagement(): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { client, config },
  } = useSdk();

  const [egPoints, setEgPoints] = useState(0);
  const [halflifeInfo, setHalflifeInfo] = useState<FormattedHalflifeInfo>();

  useEffect(() => {
    (async function updateNumMembers() {
      if (!client) return;

      try {
        const egContract = new EngagementContractQuerier(config, PoEContractType.ENGAGEMENT, client);

        const egPoints = await egContract.getTotalEngagementPoints();
        setEgPoints(egPoints);

        const halflifeInfo = await egContract.getFormattedHalflifeInfo();
        setHalflifeInfo(halflifeInfo);
      } catch (error) {
        if (!(error instanceof Error)) return;
        handleError(error);
      }
    })();
  }, [client, config, handleError]);

  return (
    <EngagementStack>
      <Title level={2}>Engagement</Title>
      <EgDataStack gap="s-4">
        <Text>Total engagement points:</Text>
        <Text>{egPoints}</Text>
      </EgDataStack>
      <EgDataStack gap="s-4">
        <Text>Half-life duration:</Text>
        <Text>{halflifeInfo?.halflifeDuration}</Text>
      </EgDataStack>
      <EgDataStack gap="s-4">
        <Text>Last half-life event:</Text>
        <Text>{`${halflifeInfo?.lastHalflifeDate.toLocaleDateString()} ${halflifeInfo?.lastHalflifeDate.toLocaleTimeString()}`}</Text>
      </EgDataStack>
      <EgDataStack gap="s-4">
        <Text>Next half-life event:</Text>
        <Text>{`${halflifeInfo?.nextHalflifeDate.toLocaleDateString()} ${halflifeInfo?.nextHalflifeDate.toLocaleTimeString()}`}</Text>
      </EgDataStack>
    </EngagementStack>
  );
}
