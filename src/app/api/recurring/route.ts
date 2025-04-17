import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import {
  createTransactions,
  generateRecurringDates,
} from "@/app/utils/recurringHelper";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      type,
      amount,
      userId,
      categoryId,
      description,
      recurrenceType,
      startDate,
      endDate,
    } = body;

    if (
      !amount ||
      !categoryId ||
      !recurrenceType ||
      !startDate ||
      !description
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const parsedStartDate = new Date(startDate);
    if (isNaN(parsedStartDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid start date provided" },
        { status: 400 }
      );
    }

    // Calculate default endDate if not provided
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const finalEndDate = endDate
      ? new Date(endDate) < oneYearFromNow
        ? new Date(endDate)
        : oneYearFromNow
      : oneYearFromNow;

    const recurringTransaction = await prisma.recurringTransaction.create({
      data: {
        type,
        userId,
        amount: new Prisma.Decimal(amount),
        note: description,
        categoryId,
        recurrenceType,
        startDate: parsedStartDate,
        endDate: finalEndDate,
      },
    });

    const recurringDates = generateRecurringDates(
      parsedStartDate,
      finalEndDate,
      recurrenceType
    );

    // Create transactions for all generated dates
    await createTransactions(recurringDates, {
      userId,
      amount: new Prisma.Decimal(amount),
      categoryId,
      note: description,
      type,
    });

    return NextResponse.json(
      {
        message: "Recurring transaction added successfully",
        data: recurringTransaction,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating recurring transaction:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
