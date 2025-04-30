import { prisma } from "@/lib/client";
import { Prisma } from "@prisma/client";

export async function calculateTotalDebit(
  householdId: number
): Promise<number> {
  try {
    // Fetch all debit transactions for the household
    const totalDebit = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: "debit",
        category: {
          householdId,
        },
      },
    });

    return totalDebit._sum.amount ? totalDebit._sum.amount.toNumber() : 0;
  } catch (error) {
    console.error("Error calculating total debit:", error);
    throw new Error("Failed to calculate total debit.");
  }
}
