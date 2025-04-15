import { NextResponse } from "next/server";
import { prisma } from "@/lib/client"; // Ensure this is your Prisma client setup

export async function POST(req: Request) {
  try {
    const { name, userId } = await req.json();

    if (!name || !userId) {
      return NextResponse.json(
        { message: "Name and userId are required." },
        { status: 400 }
      );
    }

    // Create a new household
    const newHousehold = await prisma.household.create({
      data: { name },
    });

    // Add the requesting user to the HouseholdUser table
    const newMembership = await prisma.householdUser.create({
      data: {
        userId,
        householdId: newHousehold.id,
      },
    });

    return NextResponse.json(
      {
        message: "Household created successfully.",
        household: newHousehold,
        membership: newMembership,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating household:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
