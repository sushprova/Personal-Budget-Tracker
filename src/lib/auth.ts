"use server";
import { cookies } from "next/headers";

export async function setAuthCookie(token: string) {
  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function getAuthCookie() {
  return (await cookies()).get("session")?.value;
}

export async function clearAuthCookie() {
  (await cookies()).delete("session");
}
