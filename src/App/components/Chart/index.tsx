import React from "react";
import { Line } from "@ant-design/charts";

interface ChartProps {
  config: {
    data: [];
    xField: string;
    yField: string;
    color: [];
  };
}

const Chart: React.FC<ChartProps> = ({ config }) => {
  return <Line {...config} />;
};
export default Chart;
