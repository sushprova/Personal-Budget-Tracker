"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AddIcon from "./icons/AddIcon";
import StatsIcon from "./icons/StatsIcon";
import GoalsIcon from "./icons/GoalsIcon";
import "../../styles.css";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 w-full border-t custom-footer">
      <nav className="max-w-screen-xl mx-auto">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/add"
            className={`flex flex-col items-center ${
              pathname === "/add" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            <AddIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Add</span>
          </Link>

          <Link
            href="/stats"
            className={`flex flex-col items-center ${
              pathname === "/stats" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            <StatsIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Stats</span>
          </Link>

          <Link
            href="/goals"
            className={`flex flex-col items-center ${
              pathname === "/goals" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            <GoalsIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Goals</span>
          </Link>
        </div>
      </nav>
    </footer>
  );
}
