import { Typography } from "antd";
import PageLayout from "App/components/PageLayout";
import { lazy } from "react";

import { TextStack } from "./style";

const ValidatorOverview = lazy(() => import("App/components/ValidatorOverview"));
const ValidatorProposals = lazy(() => import("App/components/ValidatorProposals"));

const { Title, Text } = Typography;

export default function ValidatorsHome(): JSX.Element | null {
  return (
    <PageLayout maxwidth="100%" centered="false">
      <TextStack>
        <Title>Validators</Title>
        <Text>Welcome to Mission Control</Text>
      </TextStack>
      <ValidatorOverview />
      <ValidatorProposals />
    </PageLayout>
  );
}
