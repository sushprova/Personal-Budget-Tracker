"use client";
import { useAuth } from "@/app/context/AuthContext";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Header({ showLogout }: { showLogout: boolean }) {
  const router = useRouter();
  const { user, households, selectedHousehold, setSelectedHousehold, refresh } =
    useAuth();

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
        location.reload();
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout.");
    }
  };

  const handleHouseholdChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = parseInt(event.target.value, 10);
    const selected =
      households?.find((household) => household.id === selectedId) || null;
    setSelectedHousehold(selected);
    location.reload();
  };
  console.log("header:", { households, selectedHousehold });
  if (!selectedHousehold) {
    refresh();
  }
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[#0A4F45]">
      <h1 className="vesto-brand  ">Vésto</h1>

      {!!user?.id && households && (
        <div className="relative">
          <select
            value={selectedHousehold?.id || ""}
            onChange={handleHouseholdChange}
            className="vesto-brand-2 font-normal p-1 text-[20px] rounded border border-[#6EBEA5] hover:bg-[#OA47T5] transition-all"
          >
            {households.map((household) => (
              <option
                key={household.id}
                value={household.id}
                className="text-[18px]"
              >
                {household.name}
              </option>
            ))}
          </select>
        </div>
      )}

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
