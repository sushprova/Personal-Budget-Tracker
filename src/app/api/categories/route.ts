/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

// Handle POST request (Create Category)
export async function POST(req: Request) {
  try {
    const { name, householdId } = await req.json();
    // console.log(name, userId);
    if (!name || !householdId) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: { name, householdId },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// Handle GET request (Fetch Categories)
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
    const categories = await prisma.category.findMany({
      where: {
        householdId: parseInt(householdId, 10),
      },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
