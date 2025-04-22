import { prisma } from "@/lib/client";
import { Decimal } from "@prisma/client/runtime/library";

export function generateRecurringDates(
  startDate: Date,
  endDate: Date,
  recurrenceType: "daily" | "weekly" | "monthly"
): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));

    if (recurrenceType === "daily") {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (recurrenceType === "weekly") {
      currentDate.setDate(currentDate.getDate() + 7);
    } else if (recurrenceType === "monthly") {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  return dates;
}

export async function createTransactions(
  dates: Date[],
  transactionDetails: {
    userId: number;
    amount: Decimal;
    categoryId: number;
    note?: string;
    type: "credit" | "debit" | "transfer";
  }
) {
  const transactions = dates.map((date) => ({
    userId: transactionDetails.userId,
    amount: transactionDetails.amount,
    categoryId: transactionDetails.categoryId,
    note: transactionDetails.note || null,
    type: transactionDetails.type,
    date: date,
  }));

  console.log("Generated dates:", dates);
  console.log("Transactions to be created:", transactions);

  // Use Prisma to create all transactions in the database
  await prisma.transaction.createMany({ data: transactions });
}
