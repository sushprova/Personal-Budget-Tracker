"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";

export default function AddTransaction() {
  const [type, setType] = useState<"credit" | "debit" | "transfer">("debit");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null); // Selected category state
  const [loading, setLoading] = useState(false);
  const { user, selectedHousehold } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!selectedHousehold) {
          alert("Please select a household before adding a transaction.");
          return;
        }
        console.log("Selected Household:", selectedHousehold);
        const response = await fetch(
          `/api/categories?householdId=${selectedHousehold!.id}`
        );
        const data = await response.json();
        // console.log("oyeeeee", data);
        // different way to get the name cause categories array is of type string and not category
        setCategories(data); // console.log(categories);
        setCategoryId(data?.[0]?.id); // Set the first category as the default
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [selectedHousehold]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit triggered!", e);
    console.warn({
      request: JSON.stringify({
        type,
        amount: parseFloat(amount),
        categoryId,
        description,
        userId: user!.id,
        date,
      }),
    });
    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          categoryId,
          description,
          userId: user!.id,
          date,
        }),
      });

      const result = await response.json();
      console.log("response", response);

      if (response.ok) {
        console.log("Transaction added:", result);
        alert("Transaction successfully added!");
        // Reset form fields after successful submission
        // setAmount("");
        // setDescription("");
        // setCategoryId(null);
        // setDate("");
      } else {
        console.error("Error adding transaction:", result.message);
        alert("Failed to add transaction. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
          className="all-heading  block mb-2 "
          style={{ fontSize: "1.3rem" }}
        >
          Category
        </label>
        <select
          value={categoryId ?? ""}
          onChange={(e) => {
            // console.warn(e.target.value);
            setCategoryId(+e.target.value);
          }}
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
