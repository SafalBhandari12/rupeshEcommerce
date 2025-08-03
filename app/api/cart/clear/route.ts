import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// DELETE /api/cart/clear - Clear all cart items for a user
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
