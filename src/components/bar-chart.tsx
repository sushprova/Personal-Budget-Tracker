import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: { date: string; debit: number; credit: number }[];
}

const BarChartComponent: React.FC<BarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="debit" fill="#7bf87c" name="Debit" />
        <Bar dataKey="credit" fill="#fa5950" name="Credit" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
