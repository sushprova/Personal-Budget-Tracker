"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SpendingGraph() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Credit",
        data: [1200, 1900, 3000, 5400, 1100, 3300],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Debit",
        data: [1500, 2000, 2700, 4900, 1400, 3700],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Income vs Expenses",
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Bar options={options} data={data} />
    </div>
  );
}
