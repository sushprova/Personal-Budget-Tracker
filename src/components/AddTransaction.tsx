"use client";

import { useState } from "react";

export default function AddTransaction() {
  const [type, setType] = useState<"credit" | "debit">("debit");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle transaction submission logic here
    console.log({ type, amount, description });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <div className="mb-4">
        <label
          className="all-heading  block mb-2 "
          style={{ fontSize: "1.3rem" }}
        >
          Transaction Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "credit" | "debit")}
          className="w-full p-2 border rounded"
        >
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>
      </div>

      <div className="mb-4">
        <label
          className="all-heading block mb-2"
          style={{ fontSize: "1.3rem" }}
        >
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter amount"
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="all-heading block mb-2"
          style={{ fontSize: "1.3rem" }}
        >
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter description"
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="all-heading  block mb-2 "
          style={{ fontSize: "1.3rem" }}
        >
          Category
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "credit" | "debit")}
          className="w-full p-2 border rounded"
        >
          <option value="paycheck">Paycheck</option>
          <option value="rent">Rent</option>
        </select>
      </div>

      <button
        type="submit"
        className="all-heading w-half bg-[#6ca9a0] text-[#0A4F45] py-2 px-4 rounded hover:bg-[#149e8a]"
        style={{ fontSize: "1.3rem" }}
      >
        Add Transaction
      </button>
    </form>
  );
}
