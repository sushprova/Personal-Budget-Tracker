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
    } catch (error: any) {
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
    } catch (error: any) {
      console.error("Error adding member:", error);
      alert("An error occurred while adding the member.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    user &&
    selectedHousehold && (
      <div className="p-4">
        <h1 className="vesto-brand text-[#0A4F45] text-[30px] m-2">
          Household
        </h1>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger
              className="vesto-brand text-[#0A4F45] text-[18px]"
              value="create"
            >
              Create New Household
            </TabsTrigger>
            <TabsTrigger
              className="vesto-brand text-[#0A4F45] text-[18px]"
              value="addMember"
            >
              Add New Member
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardContent>
                <h2 className="text-xl font-semibold m-2 vesto-brand text-[22px] text-[#0A4F45]">
                  Create New Household
                </h2>
                <Input
                  placeholder="Enter household name"
                  value={newHouseholdName}
                  onChange={(e) => setNewHouseholdName(e.target.value)}
                  className="text-xl font-semibold m-2 vesto-brand text-[22px] text-[#0A4F45]"
                />
                <Button
                  className="vesto-brand-2 m-2 mt-4 font-normal p-1.5 text-[18px] rounded border text-white bg-[#0A4f45] "
                  onClick={handleCreateHousehold}
                >
                  Create Household
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addMember">
            <Card>
              <CardContent>
                <h2 className="text-xl font-semibold m-2 vesto-brand text-[22px] text-[#0A4F45]">
                  Add New Member
                </h2>
                <Input
                  placeholder="Enter new member's email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="text-xl font-semibold m-2 vesto-brand text-[22px] text-[#0A4F45]"
                />
                <Button
                  className="vesto-brand-2 m-2 mt-4 font-normal p-1.5 text-[18px] rounded border text-white bg-[#0A4f45] "
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
    )
  );
}
