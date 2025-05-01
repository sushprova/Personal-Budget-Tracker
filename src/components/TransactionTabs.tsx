"use client";

import { useState } from "react";
import AddTransaction from "./AddTransaction";
import AddRecurringTransaction from "./AddRecurring";

export default function TransactionTabs() {
  const [activeTab, setActiveTab] = useState<"transaction" | "recurring">(
    "transaction"
  );

  return (
    <div className="w-full ">
      <div className="bg-[#0A4F45] text-[#6ca9a0] rounded-2xl p-6 w-full max-w-2xl shadow-lg">
        {/* Tabs Header */}
        <div className="flex justify-around border-b border-[#6ca9a0] mb-4">
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "transaction"
                ? "border-b-2 border-[#6ca9a0]"
                : "opacity-60"
            }`}
            onClick={() => setActiveTab("transaction")}
          >
            Add Transaction
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === "recurring"
                ? "border-b-2 border-[#6ca9a0]"
                : "opacity-60"
            }`}
            onClick={() => setActiveTab("recurring")}
          >
            Add Recurring Transaction
          </button>
        </div>

        {/* Tabs Content */}
        <div className="p-4">
          {activeTab === "transaction" && <AddTransaction />}
          {activeTab === "recurring" && <AddRecurringTransaction />}
        </div>
      </div>
    </div>
  );
}
