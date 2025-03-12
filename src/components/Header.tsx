import { LogOut } from "lucide-react";
import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[#0A4F45]">
      <h1 className="vesto-brand  ">Vésto</h1>
      <button className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#0B5D51] rounded-md transition-colors">
        <LogOut size={23} style={{ color: "#9f3608" }} />
        <span>Log out</span>
      </button>
    </header>
  );
}
