"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Header({ showLogout }: { showLogout: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/login"); // Redirect on successful logout
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout.");
    }
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[#0A4F45]">
      {/* Brand Section */}
      <h1 className="vesto-brand  ">Vésto</h1>

      {/* Logout Button */}
      {showLogout && (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#F05A28] rounded-md hover:bg-[#e0491e] transition-all"
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      )}
    </header>
  );
}
