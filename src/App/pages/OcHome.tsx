import { Typography } from "antd";
import PageLayout from "App/components/PageLayout";
import { lazy } from "react";
import { useOc } from "service/oversightCommittee";

const OcDetail = lazy(() => import("App/components/OcDetail"));
const { Text } = Typography;

export default function OcHome(): JSX.Element | null {
  const {
    ocState: { ocAddress },
  } = useOc();

  return ocAddress ? (
    <PageLayout maxwidth="75rem" centered="false">
      <OcDetail />
    </PageLayout>
  ) : (
    <PageLayout maxwidth="75rem">
      <Text>Could not find Oversight Committee</Text>
    </PageLayout>
  );
}
