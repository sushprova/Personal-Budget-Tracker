"use client";

import { Button } from "@/components/ui/button";
import { Goal } from "@prisma/client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AddGoal from "@/components/AddGoal";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, selectedHousehold } = useAuth();
  const [addGoalsFormToggle, setAddGoalsFormToggle] = useState(false);

  const toggleAddGoals = () => {
    setAddGoalsFormToggle(!addGoalsFormToggle);
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        if (!user || !selectedHousehold) {
          return;
        }

        console.log("Fetching goals:", selectedHousehold);
        const response = await fetch(
          `/api/goals?householdId=${selectedHousehold.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch goals");
        }
        const data = await response.json();
        setGoals(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user, selectedHousehold]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error while fetching goals!</div>;
  if (!goals || goals.length < 1) return <div>No goals found!</div>;

  return (
    <main className="p-8 pb-24">
      <h1 className="text-2xl font-bold mb-6">Financial Goals</h1>
      {!addGoalsFormToggle && (
        <Button onClick={toggleAddGoals}>Add Goal</Button>
      )}

      {addGoalsFormToggle && (
        <>
          <AddGoal />
          <Button onClick={toggleAddGoals}>Cancel</Button>
        </>
      )}

      {!addGoalsFormToggle && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
              style={{ borderColor: "#0A4A45", borderWidth: "3px" }}
            >
              <h2 className="text-lg font-semibold mb-2 text-gray-800">
                {goal.name.toLocaleUpperCase()}
              </h2>
              <div className="text-sm text-gray-500">
                <p>
                  <span className="font-medium">Current Amount:</span> $
                  {Number(goal.currentAmount.toString()).toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Target Amount:</span> $
                  {Number(goal.targetAmount.toString()).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
