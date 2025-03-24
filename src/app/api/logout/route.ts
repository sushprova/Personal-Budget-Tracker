import { NextRequest, NextResponse } from "next/server";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { clearAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await signOut(auth);
  await clearAuthCookie();

  redirectToLogin(req);

  return NextResponse.json({ success: true });
}

function redirectToLogin(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next(); // allow login page
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
