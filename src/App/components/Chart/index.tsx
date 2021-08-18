import React from "react";
import { Line } from "@ant-design/charts";

const data = [
  { month: "Jan", value: 3 },
  { month: "Feb", value: 3 },
  { month: "Mar", value: 3 },
  { month: "Apr", value: 3.5 },
  { month: "May", value: 4 },
  { month: "Jun", value: 4.5 },
  { month: "Jul", value: 4.9 },
  { month: "Aug", value: 6 },
  { month: "Sep", value: 7 },
  { month: "Oct", value: 9 },
  { month: "Nov", value: 13 },
];
const config = {
  data,
  autofit: "true",
  xField: "month",
  yField: "value",
  color: ["#1979C9", "#D62A0D", "#FAA219"],
};

function Chart(): JSX.Element {
  return <Line {...config} />;
}
export default Chart;
