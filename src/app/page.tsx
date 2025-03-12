// import Image from "next/image";
import TransactionHistory from "@/components/TransactionHistory";
import SpendingGraph from "../components/SpendingGraph";

export default function Home() {
  return (
    <>
      {/* <Header /> */}
      <main className="min-h-screen p-8 bg-background">
        {/* <h1 className="text-3xl font-bold mb-8">Budget Tracker</h1> */}
        {/* Recent Transactions Section */}
        <section className="mb-8">
          <h2 className="all-heading">Recent Transactions</h2>
          <TransactionHistory />
        </section>

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
