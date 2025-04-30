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
import { Category, Goal } from "@prisma/client";
import CurrentPieLoading from "./currentPieLoading";

interface Transaction {
  id: number;
  type: string;
  amount: number;
  note: string;
  date: string;
  goal: Goal;
  category: Category;
}

interface TransactionHistoryProps {
  limit?: number;
}
export default function TransactionHistory({
  limit = 5,
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, selectedHousehold } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user || !selectedHousehold) {
          return;
        }

        console.log("Fetching transactions for user:", selectedHousehold);
        const response = await fetch(
          `/api/transaction?householdId=${selectedHousehold.id}&limit=${limit}`
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

  const deleteTransaction = async (id: number) => {
    try {
      if (!user) {
        console.error("User is not authenticated.");
        return;
      }
      const response = await fetch(`/api/transaction/${id}?userId=${user.id}`, {
        method: "DELETE",
      });
      console.log("Response status:", response);

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      setTransactions((prevTransactions) =>
        prevTransactions.filter((tx) => tx.id !== id)
      );

      console.log("Transaction deleted:", id);
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
            <thead className="bg-gray-100 ">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(transaction.date).toLocaleDateString("en-US", {
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
                    {transaction.category?.name || transaction.goal?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.note}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Add the dropdown menu for each row */}
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
                              "This action will permanently delete this transaction. Want to proceed?"
                            );
                            if (confirmed) deleteTransaction(transaction.id);
                          }}
                        >
                          Delete
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
