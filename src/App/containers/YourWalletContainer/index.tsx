import Chart from "App/components/Chart";

import { ContainerWrapper } from "./style";
export default function ChartContainer(): JSX.Element | null {
  return (
    <ContainerWrapper>
      <div style={{ width: "100%", borderRadius: "16px" }}>
        <Chart />
      </div>
    </ContainerWrapper>
  );
}
