import { Typography } from "antd";
import { lazy } from "react";

import { TextStack, Wrapper } from "./style";
const ValidatorOverview = lazy(() => import("App/components/ValidatorOverview"));
const { Title, Text } = Typography;
export default function ValidatorsHome(): JSX.Element | null {
  return (
    <Wrapper>
      <TextStack>
        <Title>Validators</Title>
        <Text>Lorem ipsum dolor sita amet lorem ipsum. Text about what Validators are.</Text>
      </TextStack>
      <ValidatorOverview />
    </Wrapper>
  );
}
