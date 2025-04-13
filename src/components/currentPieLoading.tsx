/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  filterCurrentMonthTransactions,
  getMonthlyTotals,
} from "@/app/utils/transactionHelpers";
import { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { useAuth } from "@/app/context/AuthContext";

interface PieChartProps {
  data: {
    id: string;
    label: string;
    value: number;
    color: string;
  }[];
}

export function MonthlyPieChart({ data }: PieChartProps) {
  return (
    <div style={{ height: 400 }}>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={({ data }) => data.color}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState([
    {
      id: "",
      label: "",
      value: 0,
      color: "",
    },
  ]);
  const { user } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user) {
          return;
        }
        const res = await fetch(`/api/transaction?userId=${user.id}`);
        const transactions = await res.json();

        const currentMonthTx = filterCurrentMonthTransactions(transactions);
        const pieData = getMonthlyTotals(currentMonthTx);
        setData(pieData);
      } catch (err: unknown) {
        setError(err.message);
      }
    };

    fetchTransactions();
  }, [user]);

  return (
    <div className="p-4">
      <MonthlyPieChart data={data} />
    </div>
  );
}
