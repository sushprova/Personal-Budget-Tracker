"use client";

import AddGoal from "@/components/AddGoal";
import { Button } from "@/components/ui/button";
import { Goal } from "@prisma/client";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useAuth } from "../context/AuthContext";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, selectedHousehold } = useAuth();
  const [addGoalsFormToggle, setAddGoalsFormToggle] = useState(false);

  const toggleAddGoals = () => {
    setAddGoalsFormToggle(!addGoalsFormToggle);
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        if (!user || !selectedHousehold) return;

        console.log("Fetching goals:", selectedHousehold);
        const response = await fetch(
          `/api/goals?householdId=${selectedHousehold.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch goals");

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

  return (
    <main className="p-8 pb-24">
      <h1 className="vesto-brand">Financial Goals</h1>

      {!addGoalsFormToggle && (
        <Button onClick={toggleAddGoals}>Add Goal</Button>
      )}

      {addGoalsFormToggle && (
        <>
          <AddGoal />
          <Button onClick={toggleAddGoals}>Cancel</Button>
        </>
      )}

      {loading && <div>Loading...</div>}
      {error && <div>Error while fetching goals!</div>}
      {!loading && !error && (!goals || goals.length < 1) && (
        <div>No goals found!</div>
      )}

      {!addGoalsFormToggle && !loading && !error && goals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {goals.map((goal) => {
            const completionPercentage = Math.ceil(
              (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100
            );

            return (
              <div
                key={goal.id}
                className="vesto-brand bg-[#d4f4ea] rounded-lg shadow-md p-6 flex flex-col justify-between items-center"
                style={{ borderColor: "#0A4A45", borderWidth: "3px" }}
              >
                <h2 className="text-[20px] font-semibold mb-4 text-[#0A4A45]">
                  {goal.name.toLocaleUpperCase()}
                </h2>
                <div className="text-[18px] text-[#0A4A45] mb-4">
                  <p>
                    <span className="font-medium">Current Amount:</span> $
                    {Number(goal.currentAmount.toString()).toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Target Amount:</span> $
                    {Number(goal.targetAmount.toString()).toFixed(2)}
                  </p>
                </div>
                <div className="w-24 h-24">
                  <CircularProgressbar
                    value={completionPercentage}
                    text={`${completionPercentage.toFixed(0)}%`}
                    styles={buildStyles({
                      pathColor: "#0A4A45",
                      textColor: "#0A4A45",
                      trailColor: "#d4f4ea",
                      textSize: "16px",
                    })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
