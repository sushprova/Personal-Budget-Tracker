import { Transaction } from "@prisma/client";

export const getMonthlyTotals = (transactions: Transaction[]) => {
  let credit = 0;
  let debit = 0;

  transactions.forEach((tx) => {
    if (tx.type === "credit") credit += +tx.amount;
    else if (tx.type === "debit") debit += +tx.amount;
  });

  return [
    {
      id: "debit",
      label: "Debit",
      value: debit,
      color: "#4ade80",
    },
    {
      id: "credit",
      label: "Credit",
      value: credit,
      color: "#f87171",
    },
  ];
};

export const filterCurrentMonthTransactions = (transactions: Transaction[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return (
      txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
    );
  });
};
