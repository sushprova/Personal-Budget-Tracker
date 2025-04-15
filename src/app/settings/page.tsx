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
    } catch (error) {
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
          <h2 className="text-xl font-semibold mb-2">Rename Household</h2>
          <Input
            placeholder={`Enter new name for ${selectedHousehold?.name || ""}`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mb-4"
          />
          <Button
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
