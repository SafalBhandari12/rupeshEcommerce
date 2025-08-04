import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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

  // Create sample products with verified images
  const products = [
    {
      name: "Smartphone",
      description: "Latest model smartphone with advanced features",
      price: 699.99,
      stock: 50,
      categoryId: electronics.id,
      imageUrl:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&q=80",
    },
    {
      name: "Laptop",
      description: "High-performance laptop for work and gaming",
      price: 1299.99,
      stock: 30,
      categoryId: electronics.id,
      imageUrl:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&q=80",
    },
    {
      name: "Wireless Headphones",
      description: "Premium noise-cancelling wireless headphones",
      price: 299.99,
      stock: 75,
      categoryId: electronics.id,
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80",
    },
    {
      name: "T-Shirt",
      description: "Comfortable cotton t-shirt",
      price: 29.99,
      stock: 100,
      categoryId: clothing.id,
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&q=80",
    },
    {
      name: "Jeans",
      description: "Classic blue denim jeans",
      price: 79.99,
      stock: 60,
      categoryId: clothing.id,
      imageUrl:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop&q=80",
    },
    {
      name: "Programming Book",
      description: "Learn modern web development",
      price: 49.99,
      stock: 25,
      categoryId: books.id,
      imageUrl:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop&q=80",
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

  console.log("Sample data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
