import { Typography } from "antd";
import PageLayout from "App/components/PageLayout";
import Stack from "App/components/Stack/style";
import { lazy } from "react";

import { TextStack } from "./style";

const CPoolDetail = lazy(() => import("App/components/CPoolDetail"));
const { Title, Text } = Typography;

export default function CPoolHome(): JSX.Element | null {
  return (
    <PageLayout maxwidth="100%" centered="false">
      <Stack gap="s-2" style={{ width: "100%" }}>
        <TextStack>
          <Title>Community Pool</Title>
          <Text>The community pool is funded by 5% of the chain rewards</Text>
        </TextStack>
        <CPoolDetail />
      </Stack>
    </PageLayout>
  );
}
