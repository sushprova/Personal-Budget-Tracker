"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { User, Household } from "@prisma/client";
import { redirect } from "next/navigation";

const AuthContext = createContext<{
  user: User | null;
  households: Household[] | null;
  selectedHousehold: Household | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  setHouseholds: Dispatch<SetStateAction<Household[] | null>>;
  setSelectedHousehold: Dispatch<SetStateAction<Household | null>>;
  refresh: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [households, setHouseholds] = useState<Household[] | null>(null);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(
    null
  );

  async function fetchUserAndHouseholds() {
    if (typeof window !== "undefined") {
      // Exclude specific pages from redirecting
      const excludedPaths = ["/register", "/forgot-password"];
      if (
        excludedPaths.some((path) => window.location.pathname.startsWith(path))
      ) {
        return;
      }
    }
    try {
      const res = await fetch("/api/signin/me");
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched user and households:", data);
        setUser(data.userWithHouseholds);
        const fetchedHouseholds = data.userWithHouseholds.households.map(
          (h: any) => h.household
        );

        setHouseholds(fetchedHouseholds);

        // Check localStorage for previously selected household
        const storedHouseholdId = localStorage.getItem("selectedHouseholdId");
        const persistedHousehold =
          fetchedHouseholds.find(
            (household: Household) =>
              household.id === parseInt(storedHouseholdId || "", 10)
          ) || fetchedHouseholds[0]; // Default to the first household

        setSelectedHousehold(persistedHousehold);
        localStorage.setItem(
          "selectedHouseholdId",
          String(persistedHousehold.id)
        );
      } else {
        setUser(null);
        setHouseholds(null);
        setSelectedHousehold(null);
        redirect("/login");
      }
    } catch (error: any) {
      redirect("/login");
      console.error("Error fetching user and households:", error);
    }
  }

  useEffect(() => {
    fetchUserAndHouseholds();
  }, []);

  // Update localStorage whenever selectedHousehold changes
  useEffect(() => {
    if (selectedHousehold) {
      localStorage.setItem("selectedHouseholdId", String(selectedHousehold.id));
    }
    // location.reload();
  }, [selectedHousehold]);

  return (
    <AuthContext.Provider
      value={{
        user,
        households,
        selectedHousehold,
        setUser,
        setHouseholds,
        setSelectedHousehold,
        refresh: fetchUserAndHouseholds,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
