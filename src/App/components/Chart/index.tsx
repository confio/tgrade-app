import React from "react";
import { Line } from "@ant-design/charts";
import { StyledButton } from "./style";

const data = [
  { month: "Jan", value: 3 },
  { month: "Feb", value: 3 },
  { month: "Mar", value: 3 },
  { month: "Apr", value: 3.5 },
  { month: "May", value: 4 },
  { month: "Jun", value: 4.5 },
  { month: "Jul", value: 4.9 },
  { month: "Aug", value: 55 },
  { month: "Sep", value: 60 },
  { month: "Oct", value: 70 },
  { month: "Nov", value: 80 },
  { month: "Dec", value: 200 },
];
const config = {
  data,
  height: 260,
  autofit: "true",
  xField: "month",
  yField: "value",
  color: ["#1979C9", "#D62A0D", "#FAA219"],
};

/* TODO: The content below should be passed as children props to chart */
function Chart(): JSX.Element {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <h2>Your Wallet</h2>
        <div>
          <StyledButton>H</StyledButton>
          <StyledButton>D</StyledButton>
          <StyledButton>W</StyledButton>
          <StyledButton>M</StyledButton>
          <StyledButton>Y</StyledButton>
          <StyledButton>ALL</StyledButton>
        </div>
      </div>
      <Line {...config} />
    </div>
  );
}
export default Chart;
