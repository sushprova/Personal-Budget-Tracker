"use client";
// import Image from "next/image";
import TransactionHistory from "@/components/TransactionHistory";
import SpendingGraph from "../components/SpendingGraph";
import { useRouter } from "next/navigation";
import CurrentPieLoading from "@/components/currentPieLoading";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

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
          className=" vesto-brand-2 mt-4 font-normal p-1.5 text-[18px] rounded border text-white bg-[#0A4f45] 
          >"
          onClick={() => router.push("/allTransaction")}
        >
          See More
        </button>

        {/* <Footer /> */}
      </main>
    </>
  );
}
