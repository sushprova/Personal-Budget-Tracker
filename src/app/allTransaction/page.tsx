"use client";
// import Image from "next/image";
import TransactionHistory from "@/components/TransactionHistory";

export default function allTransaction() {
  return (
    <>
      <main className="min-h-screen p-8 bg-background">
        {/* <h1 className="text-3xl font-bold mb-8">Budget Tracker</h1> */}
        {/* Recent Transactions Section */}
        <section className="mb-8">
          <h2 className="all-heading">Recent Transactions</h2>
          <TransactionHistory limit={25} />
        </section>
        <button className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
          See More
        </button>
      </main>
    </>
  );
}
