import React from "react";
import { Line } from "@ant-design/charts";
import { StyledButton } from "./style";

const data = [
  { month: "Jan", value: 3 },
  { month: "Feb", value: 3.1 },
  { month: "Mar", value: 3.2 },
  { month: "Apr", value: 10 },
  { month: "May", value: 13 },
  { month: "Jun", value: 20 },
  { month: "Jul", value: 30 },
  { month: "Aug", value: 55 },
  { month: "Sep", value: 47 },
  { month: "Oct", value: 70 },
  { month: "Nov", value: 80 },
  { month: "Dec", value: 100 },
];
const config = {
  data,
  height: 260,
  autofit: "true",
  xField: "month",
  yField: "value",
  color: ["#1979C9", "#D62A0D", "#FAA219"],
  lineStyle: {
    stroke: "#FFB946",
    lineWidth: 4,
    smooth: "True",
    strokeOpacity: 1.0,
    shadowColor: "#FFFFFF",
    shadowBlur: 5,
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    cursor: "pointer",
  },
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
