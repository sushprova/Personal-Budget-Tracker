import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // const { householdId, email: memberEmail } = body;

    const { householdId, memberEmail } = body;

    if (!householdId || !memberEmail) {
      return NextResponse.json(
        { message: "Household ID and member email are required." },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: memberEmail },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User with the provided email not found." },
        { status: 404 }
      );
    }

    // Check if the user is already in the household
    const existingMembership = await prisma.householdUser.findUnique({
      where: {
        userId_householdId: {
          userId: user.id,
          householdId: Number(householdId),
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { message: "User is already a member of this household." },
        { status: 400 }
      );
    }

    // Add the user to the household
    const newMembership = await prisma.householdUser.create({
      data: {
        userId: user.id,
        householdId: Number(householdId),
      },
    });

    return NextResponse.json(
      {
        message: "User added to household successfully.",
        membership: newMembership,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding member to household:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
