import Button from "App/components/Button";
import Table from "App/components/Table";

//import { columns, data } from "./__mocks__/MockData";
import { LiquidityWrapper, StyledTabs } from "./style";
//import { ReactComponent as TgradeLogo } from "App/assets/icons/tgradeLogo.svg";

export default function LiquidyContainer(): JSX.Element | null {
  const { TabPane } = StyledTabs;

  return (
    <LiquidityWrapper>
      <StyledTabs defaultActiveKey="1">
        <TabPane tab="Trading" key="1">
          <Button
            style={{
              float: "right",
              height: "30px",
              alignItems: "center",
              margin: "5px",
              color: "#0BB0B1",
              backgroundColor: "#FFF",
            }}
          >
            Create a pair
          </Button>
          <div style={{ width: "100%", borderRadius: "16px" }}>
            <Table columns={undefined} dataSource={undefined} pagination={false} />
          </div>
        </TabPane>
        <TabPane tab="Liquidity" key="2">
          <div style={{ width: "100%", borderRadius: "16px" }}>
            <Table columns={undefined} dataSource={undefined} pagination={false} />
          </div>
        </TabPane>
      </StyledTabs>
    </LiquidityWrapper>
  );
}
