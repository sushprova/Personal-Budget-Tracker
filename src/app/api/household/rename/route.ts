import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";

export async function PATCH(req: Request) {
  try {
    const { householdId, newName } = await req.json();

    if (!householdId || !newName) {
      return NextResponse.json(
        { message: "Household ID and new name are required." },
        { status: 400 }
      );
    }

    // Update the household's name
    const updatedHousehold = await prisma.household.update({
      where: { id: householdId },
      data: { name: newName },
    });

    return NextResponse.json(
      {
        message: "Household name updated successfully.",
        household: updatedHousehold,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error renaming household:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
