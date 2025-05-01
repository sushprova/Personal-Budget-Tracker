"use client";

import DonutChartByType from "@/components/categoryPie";
import { Category, Transaction } from "@prisma/client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { DateRange, ActiveModifiers } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Card } from "@/components/ui/card";
import { calculateDailyTotals } from "../utils/calculateDailyTotals";
import BarChartComponent from "@/components/bar-chart";

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
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30), // 30 days ago
    to: new Date(),
  });
  const { user, selectedHousehold } = useAuth();

  const [dailyTotals, setDailyTotals] = useState<
    { date: string; debit: number; credit: number }[]
  >([]);

  const fetchData = async () => {
    try {
      if (!selectedHousehold) {
        return;
      }
      const transactionsRes = await fetch(
        `/api/transaction?householdId=${selectedHousehold.id}&startDate=${
          date?.from?.toUTCString() ?? addDays(new Date(), -30)
        }&endDate=${date?.to?.toUTCString()}`
      );
      const categoriesRes = await fetch(
        `/api/categories?householdId=${selectedHousehold.id}`
      );

      if (!transactionsRes.ok || !categoriesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const transactionsData: Transaction[] = await transactionsRes.json();
      // console.log("transactionsData", transactionsData);
      const categoriesData: Category[] = await categoriesRes.json();

      setTransactions(transactionsData);
      setCategories(categoriesData);

      const totals = calculateDailyTotals(transactionsData);
      setDailyTotals(totals);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4 ">
      <div className="flex align-middle justify-center gap-4 my-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={fetchData}>Search</Button>
      </div>
      <Card className="py-4">
        <DonutChartByType transactions={transactions} categories={categories} />
      </Card>
      <Card className="py-4 mt-4">
        <BarChartComponent data={dailyTotals} />
      </Card>
    </div>
  );
};
export default HomePage;
