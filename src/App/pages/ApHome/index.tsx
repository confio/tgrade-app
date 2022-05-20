import { Typography } from "antd";
import PageLayout from "App/components/PageLayout";
import Stack from "App/components/Stack/style";
import { lazy } from "react";

import { TextStack } from "./style";

const ArbiterPoolDetail = lazy(() => import("App/components/ApDetail"));
const { Title } = Typography;

export default function ApHome(): JSX.Element | null {
  return (
    <PageLayout maxwidth="75rem" centered="false">
      <Stack gap="s-2" style={{ width: "100%" }}>
        <TextStack>
          <Title>Arbiter Pool</Title>
        </TextStack>
        <ArbiterPoolDetail />
      </Stack>
    </PageLayout>
  );
}
