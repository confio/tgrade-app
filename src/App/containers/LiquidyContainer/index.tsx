import Table from "App/components/Table";
import { columns, data } from "./__mocks__/MockData";
import { LiquidityWrapper, StyledTabs } from "./style";
import Button from "App/components/Button";
//import { ReactComponent as TgradeLogo } from "App/assets/icons/tgradeLogo.svg";

export default function LiquidyContainer(): JSX.Element | null {
  function onChange(pagination: any, filters: any, sorter: any, extra: any) {
    console.log("params", pagination, filters, sorter, extra);
  }

  const { TabPane } = StyledTabs;

  function handleClick(key: number | undefined, record: any) {
    console.log(key, record);
  }
  return (
    <LiquidityWrapper>
      <StyledTabs defaultActiveKey="1">
        <TabPane tab="Trading" key="1">
          <Button style={{ float: "right", height: "30px", alignItems: "center" }}>Create a pair</Button>
          <div style={{ width: "100%", borderRadius: "16px" }}>
            <Table
              onRow={(record, rowIndex) => {
                return {
                  onClick: () => {
                    handleClick(rowIndex, record);
                  },
                };
              }}
              columns={columns}
              dataSource={data}
              onChange={onChange}
              pagination={false}
            />
          </div>
        </TabPane>
        <TabPane tab="Liquidity" key="2">
          <div style={{ width: "100%", borderRadius: "16px" }}>
            <Table columns={columns} dataSource={data} onChange={onChange} pagination={false} />
          </div>
        </TabPane>
      </StyledTabs>
    </LiquidityWrapper>
  );
}
