import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting production database seeding...");

  try {
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

    console.log("Categories created/updated successfully");

    // Create sample products with verified, optimized images
    const products = [
      {
        name: "Smartphone",
        description:
          "Latest model smartphone with advanced features and high-resolution camera",
        price: 699.99,
        stock: 50,
        categoryId: electronics.id,
        imageUrl:
          "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&q=80",
      },
      {
        name: "Laptop",
        description:
          "High-performance laptop for work and gaming with fast processor",
        price: 1299.99,
        stock: 30,
        categoryId: electronics.id,
        imageUrl:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&q=80",
      },
      {
        name: "Wireless Headphones",
        description:
          "Premium noise-cancelling wireless headphones with long battery life",
        price: 299.99,
        stock: 75,
        categoryId: electronics.id,
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80",
      },
      {
        name: "T-Shirt",
        description: "Comfortable cotton t-shirt available in multiple colors",
        price: 29.99,
        stock: 100,
        categoryId: clothing.id,
        imageUrl:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&q=80",
      },
      {
        name: "Jeans",
        description: "Classic blue denim jeans with perfect fit",
        price: 79.99,
        stock: 60,
        categoryId: clothing.id,
        imageUrl:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop&q=80",
      },
      {
        name: "Programming Book",
        description: "Learn modern web development with practical examples",
        price: 49.99,
        stock: 25,
        categoryId: books.id,
        imageUrl:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop&q=80",
      },
      {
        name: "Garden Tools Set",
        description: "Complete set of essential garden tools for your backyard",
        price: 89.99,
        stock: 40,
        categoryId: home.id,
        imageUrl:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop&q=80",
      },
      {
        name: "Coffee Maker",
        description: "Automatic coffee maker with programmable timer",
        price: 159.99,
        stock: 35,
        categoryId: home.id,
        imageUrl:
          "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop&q=80",
      },
    ];

    // Clear existing products first
    await prisma.product.deleteMany({});
    console.log("Cleared existing products");

    for (const product of products) {
      await prisma.product.create({
        data: product,
      });
      console.log(`Created product: ${product.name}`);
    }

    console.log("Products created successfully");
    console.log("Production database seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
