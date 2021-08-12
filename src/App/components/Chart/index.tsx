import React from "react";
import { Line } from "@ant-design/charts";

const data = [
  { month: "Jan", value: 3 },
  { month: "Feb", value: 3 },
  { month: "March", value: 3 },
  { month: "April", value: 4 },
  { month: "May", value: 3.5 },
  { month: "June", value: 5 },
  { month: "July", value: 4.9 },
  { month: "August", value: 6 },
  { month: "September", value: 7 },
  { month: "October", value: 9 },
  { month: "November", value: 13 },
];
const config = {
  data,
  xField: "month",
  yField: "value",
  color: ["#1979C9", "#D62A0D", "#FAA219"],
};

function Chart(): JSX.Element {
  return <Line {...config} />;
}
export default Chart;
