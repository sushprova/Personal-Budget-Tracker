/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

// Handle POST request (Create Category)
export async function POST(req: Request) {
  try {
    const { name, userId } = await req.json();
    // console.log(name, userId);
    if (!name || !userId) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: { name, userId },
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
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
