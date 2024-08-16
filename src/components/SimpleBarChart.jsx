import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import XAxisTick from "./XAxisTick";
import "../css/SimpleBarChart.css";

const SimpleBarChart = ({ data = [] }) => (
  <ResponsiveContainer width="100%" height={350}>
    <BarChart
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 60,
      }}
    >
      <CartesianGrid strokeDasharray="5 5" />
      <XAxis
        dataKey="name"
        interval={0}
        angle={-45}
        textAnchor="end"
        fontSize="small"
        fontWeight="bold"
        tick={<XAxisTick />}
      />
      <YAxis allowDecimals={false} />
      {data.length > 0 &&
        Object.keys(data[0])
          .filter((key) => key !== "name")
          .map((key) => (
            <Bar key={key} dataKey={key} fill="#DCD5D5">
              <LabelList dataKey={key} position="insideMiddle" fill="#000000" />
            </Bar>
          ))}
    </BarChart>
  </ResponsiveContainer>
);

export default SimpleBarChart;
