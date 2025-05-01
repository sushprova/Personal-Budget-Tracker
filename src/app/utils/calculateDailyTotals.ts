import { Decimal } from "@prisma/client/runtime/library";

export function calculateDailyTotals(
  transactions: {
    date: Date | string;
    type: string;
    amount: Decimal;
  }[]
): { date: string; debit: number; credit: number }[] {
  const dailyTotalsMap: Record<string, { debit: number; credit: number }> = {};

  transactions.forEach((transaction) => {
    const transactionDate =
      typeof transaction.date === "string"
        ? new Date(transaction.date)
        : transaction.date;

    if (transactionDate instanceof Date && !isNaN(transactionDate.getTime())) {
      // Format date as '30 May, 2025' using UTC
      const formattedDate = transactionDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC", // ensure UTC formatting
      });

      if (!dailyTotalsMap[formattedDate]) {
        dailyTotalsMap[formattedDate] = { debit: 0, credit: 0 };
      }

      const amount = parseFloat(transaction.amount.toString());

      if (transaction.type === "debit") {
        dailyTotalsMap[formattedDate].debit += amount;
      } else if (transaction.type === "credit") {
        dailyTotalsMap[formattedDate].credit += amount;
      }
    }
  });

  // Return the formatted data
  return Object.entries(dailyTotalsMap).map(([date, totals]) => ({
    date,
    ...totals,
  }));
}
