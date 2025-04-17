/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/client";
import { Prisma, Transaction } from "@prisma/client";
import { skip } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { off } from "process";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, amount, categoryId, description, userId, date } = body;
    // console.log("bodyyy", body);

    // Server-side validation
    if (!type || !amount || !categoryId || !description || !userId || !date) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { message: "Amount must be a positive number." },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: new Prisma.Decimal(amount),
        categoryId,
        note: description,
        userId,
        date: new Date(date),
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const householdId = searchParams.get("householdId");
    const limit = parseInt(searchParams.get("limit") ?? "50", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);
    // console.log("householdId", householdId);
    if (
      !householdId ||
      isNaN(Number(householdId)) ||
      Number(householdId) <= 0
    ) {
      return NextResponse.json(
        { message: "Invalid or missing household ID." },
        { status: 400 }
      );
    }

    // Query options

    const transactions = await prisma.transaction.findMany({
      where: {
        category: {
          householdId: +householdId,
        },
      },
      include: {
        category: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    // const transactions = await prisma.transaction.findMany(queryOptions);

    return NextResponse.json(transactions, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching transactions:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
