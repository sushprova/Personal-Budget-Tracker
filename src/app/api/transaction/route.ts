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
    console.log(body);

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

    // Save transaction to database
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
  } catch (error) {
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
    const userId = searchParams.get("userId");
    const limit = searchParams.get("limit") ?? 50;
    const offset = Number(searchParams.get("offset")) || 0;

    console.log(userId);

    if (!userId || Number(userId) <= 0) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    // query options
    const queryOptions: any = {
      where: { userId: +userId },
      include: { category: true },
      orderBy: { createdAt: Prisma.SortOrder.desc },
      take: Number(limit),
      skip: offset,
    };

    // if (limit) {
    //   queryOptions.take = Number(limit); // Only fetch the specified number of transactions
    // }

    const transactions = await prisma.transaction.findMany(queryOptions);

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
