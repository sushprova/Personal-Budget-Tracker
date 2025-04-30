"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Category, Goal } from "@prisma/client";
import { useEffect, useState } from "react";

export default function AddTransaction() {
  const [type, setType] = useState<"credit" | "debit" | "transfer">("debit");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]); // State to hold goals
  const [categoryOrGoalId, setCategoryOrGoalId] = useState<number | null>(null); // Selected category or goal
  const [loading, setLoading] = useState(false);
  const { user, selectedHousehold } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedHousehold) return;

      try {
        if (type === "transfer") {
          // Fetch goals for the household
          const response = await fetch(
            `/api/goals?householdId=${selectedHousehold.id}`
          );
          const data = await response.json();
          setGoals(data);
          setCategoryOrGoalId(data?.[0]?.id ?? null); // Default to the first goal
        } else {
          // Fetch categories for the household
          const response = await fetch(
            `/api/categories?householdId=${selectedHousehold.id}`
          );
          const data = await response.json();
          setCategories(data);
          setCategoryOrGoalId(data?.[0]?.id ?? null); // Default to the first category
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedHousehold, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          categoryId: type === "transfer" ? undefined : categoryOrGoalId,
          goalId: type === "transfer" ? categoryOrGoalId : undefined,
          description,
          userId: user!.id,
          date,
        }),
      });

      const result = await response.json();
      // console.log("Transaction result:", result);
      if (response.ok) {
        alert("Transaction successfully added!");
        setAmount("");
        setDescription("");
        setCategoryOrGoalId(null);
        setDate("");
      } else {
        alert(`Failed to add transaction: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <div className="mb-4">
        <label
          className="all-heading block mb-2"
          style={{ fontSize: "1.3rem" }}
        >
          Transaction Type
        </label>
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
          Transaction Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label
          className="all-heading block mb-2"
          style={{ fontSize: "1.3rem" }}
        >
          {type === "transfer" ? "Goal" : "Category"}
        </label>
        <select
          value={categoryOrGoalId ?? ""}
          onChange={(e) => setCategoryOrGoalId(+e.target.value)}
          className="w-full p-2 border rounded"
        >
          {type === "transfer" ? (
            goals.length > 0 ? (
              goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.name}
                </option>
              ))
            ) : (
              <option disabled>Loading goals...</option>
            )
          ) : categories.length > 0 ? (
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

      <button
        type="submit"
        className="all-heading w-half bg-[#6ca9a0] text-[#0A4F45] py-2 px-4 rounded hover:bg-[#149e8a]"
        style={{ fontSize: "1.3rem" }}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  );
}
