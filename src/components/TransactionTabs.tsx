"use client";

import AddTransaction from "./AddTransaction";

export default function TransactionTabs() {
  return (
    <div className="w-full flex justify-center">
      <div className="bg-[#0A4F45] text-[#6ca9a0] rounded-2xl p-6 w-full max-w-2xl shadow-lg">
        {/* <div className="flex border-b border-white">
          <button className="px-4 py-2 border-b-2 border-white font-semibold">
            Add Transaction
          </button>
        </div> */}

        <div className="p-4">
          <AddTransaction />
        </div>
      </div>
    </div>
  );
}
