import { prisma } from "@/lib/client";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = body;

    // Firebase registration logic
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Prisma add user logic
    const newUser = await prisma.user.create({
      data: {
        uid: user.uid, // Use Firebase UID to link it to firebase auth user
        email,
        name: username,
        currentBalance: 0, // Set the initial balance to 0
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ t: "ttetet" }, { status: 200 });
}
