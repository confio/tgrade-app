import Table from "App/components/Table";
import { columns, data } from "./__mocks__/MockData";
import { LiquidityWrapper, StyledTabs } from "./style";
import { ReactComponent as TgradeLogo } from "App/assets/icons/tgradeLogo.svg";

export default function LiquidyContainer(): JSX.Element | null {
  function onChange(pagination: any, filters: any, sorter: any, extra: any) {
    console.log("params", pagination, filters, sorter, extra);
  }

  const { TabPane } = StyledTabs;

  function callback(key: string) {
    console.log(key);
  }
  return (
    <LiquidityWrapper>
      <StyledTabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Trading" key="1">
          <div style={{ width: "100%", borderRadius: "16px" }}>
            <Table columns={columns} dataSource={data} onChange={onChange} />
          </div>
        </TabPane>
        <TabPane tab="Liquidity" key="2">
          <span>Sea of Liquidity</span>
        </TabPane>
      </StyledTabs>
    </LiquidityWrapper>
  );
}
