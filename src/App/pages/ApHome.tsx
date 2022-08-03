import { Typography } from "antd";
import PageLayout from "App/components/PageLayout";
import { lazy } from "react";
import { useAp } from "service/arbiterPool";

const ApDetail = lazy(() => import("App/components/ApDetail"));
const { Text } = Typography;

export default function ApHome(): JSX.Element | null {
  const { apAddress } = useAp();

  return apAddress ? (
    <PageLayout maxwidth="75rem" centered="false">
      <ApDetail />
    </PageLayout>
  ) : (
    <PageLayout maxwidth="75rem">
      <Text>Could not find Arbiter Pool</Text>
    </PageLayout>
  );
}
