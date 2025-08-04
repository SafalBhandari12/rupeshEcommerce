import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST() {
  try {
    // Check if it's a production environment
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        { error: "Seeding is only allowed in production" },
        { status: 403 }
      );
    }

    console.log("Starting production database seeding...");

    // Create categories
    const electronics = await prisma.category.upsert({
      where: { name: "Electronics" },
      update: {},
      create: {
        name: "Electronics",
        description: "Electronic devices and gadgets",
      },
    });

    const clothing = await prisma.category.upsert({
      where: { name: "Clothing" },
      update: {},
      create: {
        name: "Clothing",
        description: "Fashion and apparel",
      },
    });

    const books = await prisma.category.upsert({
      where: { name: "Books" },
      update: {},
      create: {
        name: "Books",
        description: "Books and educational materials",
      },
    });

    const home = await prisma.category.upsert({
      where: { name: "Home & Garden" },
      update: {},
      create: {
        name: "Home & Garden",
        description: "Home improvement and garden supplies",
      },
    });

    // Create sample products
    const products = [
      {
        name: "Smartphone",
        description:
          "Latest model smartphone with advanced features and high-resolution camera",
        price: 699.99,
        stock: 50,
        categoryId: electronics.id,
        imageUrl:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
      },
      {
        name: "Laptop",
        description:
          "High-performance laptop for work and gaming with fast processor",
        price: 1299.99,
        stock: 30,
        categoryId: electronics.id,
        imageUrl:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
      },
      {
        name: "Wireless Headphones",
        description:
          "Premium noise-cancelling wireless headphones with long battery life",
        price: 299.99,
        stock: 75,
        categoryId: electronics.id,
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      },
      {
        name: "T-Shirt",
        description: "Comfortable cotton t-shirt available in multiple colors",
        price: 29.99,
        stock: 100,
        categoryId: clothing.id,
        imageUrl:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      },
      {
        name: "Jeans",
        description: "Classic blue denim jeans with perfect fit",
        price: 79.99,
        stock: 60,
        categoryId: clothing.id,
        imageUrl:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
      },
      {
        name: "Programming Book",
        description: "Learn modern web development with practical examples",
        price: 49.99,
        stock: 25,
        categoryId: books.id,
        imageUrl:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop",
      },
      {
        name: "Garden Tools Set",
        description: "Complete set of essential garden tools for your backyard",
        price: 89.99,
        stock: 40,
        categoryId: home.id,
        imageUrl:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop",
      },
      {
        name: "Coffee Maker",
        description: "Automatic coffee maker with programmable timer",
        price: 159.99,
        stock: 35,
        categoryId: home.id,
        imageUrl:
          "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
      },
    ];

    for (const product of products) {
      await prisma.product
        .create({
          data: product,
        })
        .catch(() => {
          console.log(`Product ${product.name} already exists, skipping...`);
        });
    }

    console.log("Production database seeding completed successfully!");

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      categoriesCreated: 4,
      productsCreated: products.length,
    });
  } catch (error) {
    console.error("Error during seeding:", error);
    return NextResponse.json(
      { error: "Internal server error during seeding" },
      { status: 500 }
    );
  }
}
