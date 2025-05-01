"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Goal, Prisma } from "@prisma/client";
import { useState } from "react";

export default function AddGoal({ defaultValues }: { defaultValues?: Goal }) {
  const [currentAmount, setCurrentAmount] = useState(
    defaultValues?.currentAmount || 0
  );
  const [targetAmount, setTargetAmount] = useState(
    defaultValues?.targetAmount || 0
  );
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, selectedHousehold } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    if (!selectedHousehold?.id) {
      console.warn("no householdId");
      return;
    }
    console.log("handleSubmit triggered!", e);
    console.warn({
      request: JSON.stringify({
        currentAmount: Number(currentAmount.toString()),
        targetAmount: Number(targetAmount.toString()),
        name,
        householdId: selectedHousehold?.id,
      }),
    });
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentAmount: Number(currentAmount.toString()),
          targetAmount: Number(targetAmount.toString()),
          name,
          householdId: selectedHousehold?.id,
        }),
      });

      const result = await response.json();
      console.log("response", response);

      if (response.ok) {
        console.log("Goal added!");
        alert("Goal successfully added!");
        // Reset form fields after successful submission
      } else {
        console.error("Error adding goal:", result.message);
        alert("Failed to add goal. Please try again.");
      }
    } catch (error: any) {
      console.error("Error:", error);
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
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter goal name"
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="all-heading block mb-2"
          style={{ fontSize: "1.3rem" }}
        >
          Target Amount
        </label>
        <input
          type="number"
          value={targetAmount as number}
          onChange={(e) => setTargetAmount(new Prisma.Decimal(e.target.value))}
          className="w-full p-2 border rounded"
          placeholder="Enter target amount"
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="all-heading block mb-2"
          style={{ fontSize: "1.3rem" }}
        >
          Current Amount
        </label>
        <input
          type="number"
          value={currentAmount as number}
          onChange={(e) => setCurrentAmount(new Prisma.Decimal(e.target.value))}
          className="w-full p-2 border rounded"
          placeholder="Enter current amount"
        />
      </div>

      <button
        type="submit"
        className="all-heading w-half bg-[#6ca9a0] text-[#0A4F45] py-2 px-4 rounded hover:bg-[#149e8a]"
        style={{ fontSize: "1.3rem" }}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Goal"}
      </button>
    </form>
  );
}
