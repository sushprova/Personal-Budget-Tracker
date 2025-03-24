"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  SetStateAction,
  Dispatch,
} from "react";
import { User } from "@prisma/client";

const AuthContext = createContext<{
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/signin/me"); // API to get logged-in user
      if (res.ok) {
        const data = await res.json();
        setUser(data.user as User);
      } else {
        setUser(null);
        // router.push("/login"); // Redirect if not logged in
      }
    }

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
