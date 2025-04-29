import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Missing email" }, { status: 400 });

    // Send reset password email with Firebase Auth
    await sendPasswordResetEmail(auth, email);

    return NextResponse.json(
      { message: "Password reset email sent successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
