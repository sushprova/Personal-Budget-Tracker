import { Prisma, Transaction } from "@prisma/client";
import { useAuth } from "../context/AuthContext";

/**
 * Summarizes transactions for the selected household into totals for credits and debits.
 * Subtracts transfer transactions from the debit total.
 * @param transactions - Array of transactions with their related category
 * @param householdId - ID of the selected household
 * @returns Pie chart data with debit and credit totals
 */

export const getMonthlyTotalsForHousehold = (
  transactions: (Transaction & {
    category?: { householdId: number };
    goal?: { householdId: number };
  })[],
  householdId: number
) => {
  let credit = 0;
  let debit = 0;
  let transfers = 0;

  // Filter transactions by the selected household ID
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.category?.householdId === householdId ||
      tx.goal?.householdId === householdId ||
      tx.type === "transfer"
  );

  // Calculate totals
  filteredTransactions.forEach((tx) => {
    if (tx.type === "credit") {
      credit += +tx.amount;
    } else if (tx.type === "debit") {
      debit += +tx.amount;
    } else if (tx.type === "transfer") {
      transfers += +tx.amount;
    }
  });

  console.log("Debit before transfers:", filteredTransactions);
  // Subtract transfer amounts from debit
  debit -= transfers;
  console.log({ debit, transfers, credit });

  return [
    {
      id: "debit",
      label: "Debit",
      value: debit,
      color: "#4ade80", // Green for debit
    },
    {
      id: "credit",
      label: "Credit",
      value: credit,
      color: "#f87171", // Red for credit
    },
  ];
};

/**
 * Filters transactions for the current month and the selected household.
 * @param transactions - Array of transactions with their related category
 * @param householdId - ID of the selected household
 * @returns Array of transactions for the current month and household
 */
export const filterCurrentMonthTransactionsForHousehold = (
  transactions: (Transaction & {
    category?: { householdId: number };
    goal?: { householdId: number };
  })[],
  householdId: number
) => {
  const now = new Date();
  const currentMonth = now.getUTCMonth();
  const currentYear = now.getUTCFullYear();

  return transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return (
      (tx.category?.householdId === householdId ||
        tx.goal?.householdId === householdId) &&
      txDate.getUTCMonth() === currentMonth &&
      txDate.getUTCFullYear() === currentYear
    );
  });
};
