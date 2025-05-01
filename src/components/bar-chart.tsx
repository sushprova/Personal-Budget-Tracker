/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/BarChartByType.js
"use client";

import { ResponsivePie } from "@nivo/pie";
import { colorPool } from "@/app/utils/colorPool";
import {
  assignColorsToCategories,
  prepareDonutDataByType,
} from "@/app/utils/separateCategories";
import { Category, Transaction } from "@prisma/client";
import { BarChart } from "recharts";

const BarChartByType = ({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) => {
  const categoriesWithColors = assignColorsToCategories(categories, colorPool);
  const creditData = prepareDonutDataByType(
    transactions,
    categoriesWithColors,
    "credit"
  );
  const debitData = prepareDonutDataByType(
    transactions,
    categoriesWithColors,
    "debit"
  );
  const transferData = prepareDonutDataByType(
    transactions,
    categoriesWithColors,
    "transfer"
  );
  return (
    <div className="flex flex-col md:flex-row gap-8 justify-between">
      {/* Credit Chart */}
      <div style={{ height: "400px", width: "400px" }}>
        <h3 className="text-center text-lg font-semibold mb-4">Expenses</h3>
        <BarChart
          data={creditData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          // cornerRadius={3}
          // activeOuterRadiusOffset={8}
          // colors={({ data }) => data.color}
          // borderWidth={1}
          // borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          // arcLinkLabelsSkipAngle={10}
          // arcLinkLabelsTextColor="#333333"
          // arcLinkLabelsThickness={2}
          // arcLinkLabelsColor={{ from: "color" }}
          // arcLabelsSkipAngle={10}
          // arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        />
      </div>

      {/* Debit Chart */}
      <div style={{ height: "400px", width: "400px" }}>
        <h3 className="text-center text-lg font-semibold mb-4">Income</h3>
        <ResponsivePie
          data={debitData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={({ data }) => data.color}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        />
      </div>

      {/* Debit Chart */}
      <div style={{ height: "400px", width: "400px" }}>
        <h3 className="text-center text-lg font-semibold mb-4">Transfers</h3>
        <ResponsivePie
          data={transferData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={({ data }) => data.color}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        />
      </div>
    </div>
  );
};

export default BarChartByType;
