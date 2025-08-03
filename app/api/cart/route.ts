import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/cart - Get cart items for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { userId, productId, quantity = 1 } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "User ID and Product ID are required" },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
      return NextResponse.json(updatedItem);
    } else {
      // Create new cart item
      const newItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
      return NextResponse.json(newItem);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const { itemId, quantity } = await request.json();

    if (!itemId || quantity < 1) {
      return NextResponse.json(
        { error: "Valid item ID and quantity are required" },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
