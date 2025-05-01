"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../context/AuthContext";

export default function RenameHousehold() {
  const { selectedHousehold } = useAuth();
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRename = async () => {
    if (!selectedHousehold) {
      alert("Please select a household first.");
      return;
    }

    if (!newName.trim()) {
      alert("New name cannot be empty.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/household/rename", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          householdId: selectedHousehold.id,
          newName,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Household name updated successfully!");
        setNewName(""); // Clear the input field
      } else {
        alert(result.message || "Failed to rename household.");
      }
    } catch (error: any) {
      console.error("Error renaming household:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardContent>
          <h2 className="vesto-brand-2 mt-4 font-normal p-1.5 text-[22px] rounded border text-white bg-[#0A4f45]">
            Rename Household
          </h2>
          <Input
            className="mb-4 text-[20px] placeholder:text-[20px]"
            placeholder={`Enter new name for ${selectedHousehold?.name || ""}`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button
            className="vesto-brand-2 mt-4 font-normal p-1.5 text-[18px] rounded border text-white bg-[#0A4f45] "
            onClick={handleRename}
            disabled={isLoading || !newName.trim()}
          >
            {isLoading ? "Renaming..." : "Rename Household"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
