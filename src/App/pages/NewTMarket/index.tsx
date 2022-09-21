import { Typography } from "antd";
import PageLayout from "App/components/PageLayout";
import { PairSelector } from "App/components/PairSelector";
import Stack from "App/components/Stack/style";
import { TMarketForm } from "App/components/TMarketForm";

const { Title } = Typography;

export default function NewTMarket(): JSX.Element {
  return (
    <PageLayout maxwidth="46.125rem" centered="false">
      <Stack gap="s4" style={{ width: "100%" }}>
        <Title style={{ alignSelf: "flex-start" }}>T-Market</Title>
        <div
          style={{
            width: "100%",
            height: "400px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            border: "1px solid #EEE9E9",
          }}
        >
          <PairSelector />
          <TMarketForm />
        </div>
      </Stack>
    </PageLayout>
  );
}
