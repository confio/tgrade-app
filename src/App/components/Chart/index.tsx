import React from "react";
import { Line } from "@ant-design/charts";
import { StyledButton } from "./style";

const data = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 0 },
  { month: "Mar", value: 0 },
  { month: "Apr", value: 0 },
  { month: "May", value: 0 },
  { month: "Jun", value: 0 },
  { month: "Jul", value: 0 },
  { month: "Aug", value: 0 },
  { month: "Sep", value: 0 },
  { month: "Oct", value: 0 },
  { month: "Nov", value: 0 },
  { month: "Dec", value: 0 },
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
    lineWidth: 0,
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
      <div style={{ display: "flex", width: "100%" }}>
        <h2 style={{ margin: "5px" }}>Your Wallet</h2>
        <div style={{ marginLeft: "400px" }}>
          <StyledButton.Group size="small">
            <StyledButton.Button value="h">H</StyledButton.Button>
            <StyledButton.Button value="d">D</StyledButton.Button>
            <StyledButton.Button value="w">W</StyledButton.Button>
            <StyledButton.Button value="m">M</StyledButton.Button>
            <StyledButton.Button value="y">Y</StyledButton.Button>
          </StyledButton.Group>
        </div>
      </div>
      <Line {...config} />
    </div>
  );
}
export default Chart;
