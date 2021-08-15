import Table from "App/components/Table";
import { columns, data } from "./__mocks__/MockData";
import { LiquidityWrapper } from "./style";

export default function LiquidyContainer(): JSX.Element | null {
  function onChange(pagination: any, filters: any, sorter: any, extra: any) {
    console.log("params", pagination, filters, sorter, extra);
  }
  return (
    <LiquidityWrapper>
      <div style={{ width: "100%", borderRadius: "16px" }}>
        <Table columns={columns} dataSource={data} onChange={onChange} />
      </div>
    </LiquidityWrapper>
  );
}
