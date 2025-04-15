"use client";

import DonutChartByType from "@/components/categoryPie";
import { Category, Transaction } from "@prisma/client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// interface Transaction {
//   id: number;
//   amount: number;
//   type: "credit" | "debit";
//   category: {
//     name: string;
//   };
// }

// interface Category {
//   id: number;
//   name: string;
// }

const HomePage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, selectedHousehold } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedHousehold) {
          return;
        }
        const transactionsRes = await fetch(
          `/api/transaction?householdId=${selectedHousehold.id}`
        );
        const categoriesRes = await fetch(
          `/api/categories?householdId=${selectedHousehold.id}`
        );

        if (!transactionsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const transactionsData: Transaction[] = await transactionsRes.json();
        const categoriesData: Category[] = await categoriesRes.json();

        setTransactions(transactionsData);
        setCategories(categoriesData);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <DonutChartByType transactions={transactions} categories={categories} />
    </div>
  );
};

export default HomePage;
