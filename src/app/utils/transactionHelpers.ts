import { Prisma, Transaction } from "@prisma/client";

/**
 * Summarizes transactions for the selected household into totals for credits and debits.
 * @param transactions - Array of transactions with their related category
 * @param householdId - ID of the selected household
 * @returns Pie chart data with debit and credit totals
 */
export const getMonthlyTotalsForHousehold = (
  transactions: (Transaction & { category: { householdId: number } })[],
  householdId: number
) => {
  let credit = 0;
  let debit = 0;

  // Filter transactions by the selected household ID
  const filteredTransactions = transactions.filter(
    (tx) => tx.category?.householdId === householdId
  );

  // Calculate totals
  filteredTransactions.forEach((tx) => {
    if (tx.type === "credit") credit += +tx.amount;
    else if (tx.type === "debit") debit += +tx.amount;
  });

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
  transactions: (Transaction & { category: { householdId: number } })[],
  householdId: number
) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return (
      tx.category?.householdId === householdId &&
      txDate.getMonth() === currentMonth &&
      txDate.getFullYear() === currentYear
    );
  });
};
