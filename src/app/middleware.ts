import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/verifyFirebaseToken"; // ✅ use your util

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;

  console.warn("TOKEN", token);
  if (!token) {
    return redirectToLogin(req);
  }

  const payload = await verifyFirebaseToken(token);
  console.log("PAYLOAD", payload);
  if (!payload) {
    return redirectToLogin(req);
  }

  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  // if (req.nextUrl.pathname.startsWith("/login")) {
  //   return NextResponse.next(); // allow login page
  // }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/**",
    // "/add", "category"
  ], // adjust as needed
};
