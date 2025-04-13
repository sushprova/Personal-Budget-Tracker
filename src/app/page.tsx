"use client";
// import Image from "next/image";
import TransactionHistory from "@/components/TransactionHistory";
import SpendingGraph from "../components/SpendingGraph";
import { useRouter } from "next/navigation";
import CurrentPieLoading from "@/components/currentPieLoading";

export default function Home() {
  const router = useRouter();

  return (
    <>
      {/* <Header /> */}
      <main className="min-h-screen p-8 bg-background">
        {/* <h1 className="text-3xl font-bold mb-8">Budget Tracker</h1> */}
        {/* Recent Transactions Section */}
        <section className="mb-8">
          <h2 className="all-heading">Recent Month Stat</h2>

          <CurrentPieLoading />
        </section>
        <section className="mb-8">
          <h2 className="all-heading">Recent Transactions</h2>
          <TransactionHistory />
        </section>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          onClick={() => router.push("/allTransaction")}
        >
          See More
        </button>
        {/* Monthly Graph Section */}
        <section className="mb-8">
          <h2 className="all-heading pt-9">Monthly Overview</h2>
          <SpendingGraph />
        </section>

        {/* <Footer /> */}
      </main>
    </>
  );
}
