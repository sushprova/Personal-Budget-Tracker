"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../context/AuthContext";

export default function Household() {
  const { user, selectedHousehold } = useAuth();
  const [newHouseholdName, setNewHouseholdName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateHousehold = async () => {
    if (!newHouseholdName.trim()) {
      alert("Household name cannot be empty.");
      return;
    }
    if (!user) {
      alert("User not found.");
      return;
    }

    try {
      const response = await fetch("/api/household/addHousehold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newHouseholdName,
          userId: user.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Household created successfully!");
        console.log("New household:", result.household);
        console.log("New membership:", result.membership);
        setNewHouseholdName("");
      } else {
        alert(
          result.message || "Failed to create household. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating household:", error);
      alert("An error occurred while creating the household.");
    }
  };

  const handleAddMember = async () => {
    if (!selectedHousehold) {
      alert("Please select a household before adding members.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/addMember", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // email: memberEmail,
          memberEmail,
          householdId: selectedHousehold.id,
        }),
      });
      //   console.log("Response:", response);
      const result = await response.json();
      //   console.log("Result:", result);
      if (response.ok) {
        alert(result.message || "Member added successfully!");
        setMemberEmail(""); // Clear the email field after success
      } else {
        alert(result.message || "Failed to add member. Please try again.");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("An error occurred while adding the member.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Household</h1>
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="create">Create New Household</TabsTrigger>
          <TabsTrigger value="addMember">Add New Member</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">
                Create New Household
              </h2>
              <Input
                placeholder="Enter household name"
                value={newHouseholdName}
                onChange={(e) => setNewHouseholdName(e.target.value)}
                className="mb-4"
              />
              <Button onClick={handleCreateHousehold}>Create Household</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addMember">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Add New Member</h2>
              <Input
                placeholder="Enter new member's email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="mb-4"
              />
              <Button
                onClick={handleAddMember}
                disabled={isLoading || !memberEmail}
              >
                {isLoading ? "Adding..." : "Add Member"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
