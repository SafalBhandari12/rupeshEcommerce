import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log("Testing database connection and data...");

    // Test categories
    const categories = await prisma.category.findMany();
    console.log(
      `Found ${categories.length} categories:`,
      categories.map((c) => c.name)
    );

    // Test products
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    console.log(`Found ${products.length} products:`);
    products.forEach((product) => {
      console.log(
        `- ${product.name} (${product.category.name}) - $${product.price} - Stock: ${product.stock}`
      );
    });

    // Test API endpoints
    console.log("\nTesting API endpoints...");

    // Test categories API
    const categoriesResponse = await fetch(
      "http://localhost:3000/api/categories"
    );
    console.log("Categories API status:", categoriesResponse.status);
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      console.log("Categories API data:", categoriesData.length, "categories");
    }

    // Test products API
    const productsResponse = await fetch("http://localhost:3000/api/products");
    console.log("Products API status:", productsResponse.status);
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log("Products API data:", productsData.length, "products");
    }
  } catch (error) {
    console.error("Error testing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
