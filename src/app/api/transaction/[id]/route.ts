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
  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) },
    });
    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }
    if (transaction.userId !== Number(userId)) {
      return NextResponse.json(
        { message: "Unauthorized action" },
        { status: 403 }
      );
    }
    await prisma.transaction.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
