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

    const newUserAndHousehold = await prisma.$transaction(async (prisma) => {
      // Create a new household
      const newHousehold = await prisma.household.create({
        data: {
          name: `${username}'s Household`, // Customize the default household name if needed
        },
      });

      // Create the user and associate it with the household
      const newUser = await prisma.user.create({
        data: {
          uid: user.uid, // Use Firebase UID to link it to firebase auth user
          email,
          name: username,
          households: {
            create: {
              householdId: newHousehold.id,
            },
          },
        },
      });

      return { newHousehold, newUser };
    });

    return NextResponse.json(newUserAndHousehold, { status: 201 });
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
