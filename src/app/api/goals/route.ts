/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

// Handle POST request (Create Goal)
export async function POST(req: Request) {
  console.log("POST request received");

  try {
    // Parse the request body only once
    const { name, currentAmount, targetAmount, householdId } = await req.json();
    console.log("Received body:", {
      name,
      currentAmount,
      targetAmount,
      householdId,
    });

    // Validate input
    if (!name || !currentAmount || !targetAmount || !householdId) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Create the goal
    const newGoal = await prisma.goal.create({
      data: { name, currentAmount, targetAmount, householdId },
    });

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error: any) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Failed to create Goal" },
      { status: 500 }
    );
  }
}

// Handle GET request (Fetch goals)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const householdId = searchParams.get("householdId");

    if (!householdId) {
      return NextResponse.json(
        { error: "householdId is required" },
        { status: 400 }
      );
    }
    const goals = await prisma.goal.findMany({
      where: {
        householdId: parseInt(householdId, 10),
      },
    });
    return NextResponse.json(goals, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}
