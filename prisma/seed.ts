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

  // Create sample products
  const products = [
    {
      name: "Smartphone",
      description: "Latest model smartphone with advanced features",
      price: 699.99,
      stock: 50,
      categoryId: electronics.id,
    },
    {
      name: "Laptop",
      description: "High-performance laptop for work and gaming",
      price: 1299.99,
      stock: 30,
      categoryId: electronics.id,
    },
    {
      name: "Wireless Headphones",
      description: "Premium noise-cancelling wireless headphones",
      price: 299.99,
      stock: 75,
      categoryId: electronics.id,
    },
    {
      name: "T-Shirt",
      description: "Comfortable cotton t-shirt",
      price: 29.99,
      stock: 100,
      categoryId: clothing.id,
    },
    {
      name: "Jeans",
      description: "Classic blue denim jeans",
      price: 79.99,
      stock: 60,
      categoryId: clothing.id,
    },
    {
      name: "Programming Book",
      description: "Learn modern web development",
      price: 49.99,
      stock: 25,
      categoryId: books.id,
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
