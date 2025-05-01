/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculateTotalDebit } from "@/app/utils/totalDebit";
import { prisma } from "@/lib/client";
import { Prisma, Transaction } from "@prisma/client";
import { addDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { off } from "process";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, amount, categoryId, goalId, description, userId, date } =
      body;

    // Server-side validation
    if (!type || !amount || !description || !userId || !date) {
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

    if (type === "transfer" && !goalId) {
      return NextResponse.json(
        { message: "Goal ID is required for transfer transactions." },
        { status: 400 }
      );
    }

    if (type === "transfer") {
      // Fetch the goal and validate
      const goal = await prisma.goal.findUnique({
        where: { id: goalId },
      });

      if (!goal) {
        return NextResponse.json(
          { message: "Goal not found." },
          { status: 404 }
        );
      }

      // Calculate total debit for the household
      const totalDebit = await calculateTotalDebit(goal.householdId);

      if (totalDebit < amount) {
        return NextResponse.json(
          { message: "Insufficient debit balance to complete the transfer." },
          { status: 400 }
        );
      }

      // Create the transfer transaction
      const transaction = await prisma.transaction.create({
        data: {
          type,
          amount: new Prisma.Decimal(amount),
          note: description,
          userId,
          date: new Date(date),
          goalId,
        },
      });

      // Update the goal's balance
      const updatedGoal = await prisma.goal.update({
        where: { id: goalId },
        data: {
          currentAmount: {
            increment: new Prisma.Decimal(amount),
          },
        },
      });

      return NextResponse.json(
        {
          transaction,
          updatedGoal,
          totalDebitAfter: totalDebit - amount, // Optional: return remaining debit balance
        },
        { status: 201 }
      );
    } else {
      // Handle credit or debit transactions
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
    }
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
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
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

    const today = new Date();

    const transactions = await prisma.transaction.findMany({
      where: {
        AND: [
          {
            date: {
              gte:
                startDate && !isNaN(new Date(startDate).getTime())
                  ? new Date(startDate)
                  : undefined,
              lte:
                endDate && !isNaN(new Date(endDate).getTime())
                  ? new Date(endDate)
                  : undefined,
            },
          },
          {
            OR: [
              { category: { householdId: +householdId } },
              { goal: { householdId: +householdId } },
            ],
          },
          {
            OR: [
              { recurringTransactionId: null },
              {
                AND: [
                  { recurringTransactionId: { not: null } },
                  { date: { lte: today } },
                ],
              },
            ],
          },
        ],
      },
      include: {
        category: true,
        user: true,
        goal: true,
      },
      orderBy: {
        date: "desc",
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
