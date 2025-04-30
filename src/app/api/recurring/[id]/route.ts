import { prisma } from "@/lib/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { params } = context;
  const { id } = await params;
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const deleteType = url.searchParams.get("deleteType"); // "all" or "future"

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const recurringTransaction = await prisma.recurringTransaction.findUnique({
      where: { id: Number(id) },
    });

    if (!recurringTransaction) {
      return NextResponse.json(
        { message: "Recurring transaction not found" },
        { status: 404 }
      );
    }

    if (recurringTransaction.userId !== Number(userId)) {
      return NextResponse.json(
        { message: "Unauthorized action" },
        { status: 403 }
      );
    }

    if (deleteType === "all") {
      await prisma.transaction.deleteMany({
        where: { recurringTransactionId: Number(id) },
      });

      await prisma.recurringTransaction.delete({
        where: { id: Number(id) },
      });
    } else if (deleteType === "future") {
      const today = new Date(new Date().toISOString());

      await prisma.transaction.deleteMany({
        where: {
          recurringTransactionId: Number(id),
          date: { gt: today },
        },
      });
    }

    return NextResponse.json(
      { message: "Recurring transaction processed successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing recurring transaction:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
