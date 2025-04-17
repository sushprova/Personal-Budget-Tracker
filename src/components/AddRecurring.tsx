"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";

export default function AddRecurringTransaction() {
  const [type, setType] = useState<"credit" | "debit" | "transfer">("debit");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [recurrenceType, setRecurrenceType] = useState<
    "daily" | "weekly" | "monthly"
  >("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, selectedHousehold } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!selectedHousehold) {
          // alert("Please select a household before adding a transaction.");
          return;
        }
        const response = await fetch(
          `/api/categories?householdId=${selectedHousehold!.id}`
        );
        const data = await response.json();
        setCategories(data);
        setCategoryId(data?.[0]?.id); // Default to the first category
      } catch (error: any) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [selectedHousehold]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHousehold) {
      alert("Please select a household before adding a transaction.");
      return;
    }

    setLoading(true);

    try {
      // const oneYearFromNow = new Date();
      // oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      // const finalEndDate = endDate
      //   ? new Date(endDate) < oneYearFromNow
      //     ? new Date(endDate)
      //     : oneYearFromNow
      //   : oneYearFromNow;

      const response = await fetch("/api/recurring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          categoryId,
          userId: user!.id,
          description,
          recurrenceType,
          startDate,
          endDate: endDate || null,
        }),
      });

      const result = await response.json();
      console.log("Resultyyyy:", result);
      if (response.ok) {
        alert("Recurring transaction successfully added!");
        // Reset form fields
        setAmount("");
        setDescription("");
        setCategoryId(null);
        setRecurrenceType("monthly");
        setStartDate("");
        setEndDate(null);
      } else {
        console.error("Error adding recurring transaction:", result.message);
        alert("Failed to add recurring transaction. Please try again.");
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Transaction Type</label>
        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value as "credit" | "debit" | "transfer")
          }
          className="w-full p-2 border rounded"
        >
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Amount</label>
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
        <label className="block mb-2 font-semibold">Category</label>
        <select
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(+e.target.value)}
          className="w-full p-2 border rounded"
        >
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          ) : (
            <option disabled>Loading categories...</option>
          )}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Description</label>
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
        <label className="block mb-2 font-semibold">Recurrence Type</label>
        <select
          value={recurrenceType}
          onChange={(e) =>
            setRecurrenceType(e.target.value as "daily" | "weekly" | "monthly")
          }
          className="w-full p-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">End Date (Optional)</label>
        <input
          type="date"
          value={endDate || ""}
          onChange={(e) => setEndDate(e.target.value || null)}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="all-heading w-half bg-[#6ca9a0] text-[#0A4F45] py-2 px-4 rounded hover:bg-[#149e8a]"
        style={{ fontSize: "1.3rem" }}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Recurring Transaction"}
      </button>
    </form>
  );
}
