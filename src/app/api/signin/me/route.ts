/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/client";
import { verifyFirebaseToken } from "@/lib/verifyFirebaseToken";

export async function GET() {
  const token = (await cookies()).get("session")?.value;
  if (!token)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const decoded = await verifyFirebaseToken(token);
  if (!decoded)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const userWithHouseholds = await prisma.user.findUnique({
    where: { uid: decoded.user_id as string },
    include: {
      households: {
        include: {
          household: true, // Include the household details
        },
      },
    },
  });

  if (!userWithHouseholds)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ userWithHouseholds });
}
