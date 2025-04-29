"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Category } from "@prisma/client";

interface RecurringTransaction {
  id: number;
  type: string;
  recurrenceType: string;
  amount: number;
  note: string;
  startDate: string;
  endDate: string;
  category: Category;
}

interface TransactionHistoryProps {
  limit?: number;
}
export default function TransactionHistory({
  limit = 5,
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, selectedHousehold } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user || !selectedHousehold) {
          return;
        }

        console.log(
          "Fetching recurring transactions for user:",
          selectedHousehold
        );
        const response = await fetch(
          `/api/recurring?householdId=${selectedHousehold.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const deleteTransaction = async (
    id: number,
    deleteType: "all" | "future"
  ) => {
    try {
      if (!user) {
        return;
      }
      const response = await fetch(
        `/api/recurring/${id}?userId=${user.id}&deleteType=${deleteType}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      setTransactions((prevTransactions) =>
        prevTransactions.filter((tx) => tx.id !== id)
      );

      console.log(`Transaction deleted (${deleteType}):`, id);
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
    }
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              style={{ backgroundColor: "#6EBEA5" }}
              className="vesto-brand "
            >
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase">
                  Recurrence Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase">
                  Description
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(transaction.startDate).toLocaleDateString(
                      "en-US",
                      {
                        timeZone: "UTC",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(transaction.endDate).toLocaleDateString("en-US", {
                      timeZone: "UTC",

                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === "credit"
                          ? "bg-red-100 text-red-800"
                          : transaction.type === "debit"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.recurrenceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.category?.name || "No category"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.note}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Add the dropdown menu for each row from here */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-blue-500">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {/* <DropdownMenuItem
                        onClick={() => console.log("Editing:", transaction)}
                      >
                        Edit
                      </DropdownMenuItem> */}
                        <DropdownMenuItem
                          onClick={() => {
                            const confirmed = window.confirm(
                              "This action will permanently delete all transactions. Want to proceed?"
                            );
                            if (confirmed)
                              deleteTransaction(transaction.id, "all");
                          }}
                        >
                          Delete All Transactions
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const confirmed = window.confirm(
                              "This action will permanently delete only future transactions. Want to proceed?"
                            );
                            if (confirmed)
                              deleteTransaction(transaction.id, "future");
                          }}
                        >
                          Delete Future Transactions
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
