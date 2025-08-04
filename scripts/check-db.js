const { PrismaClient } = require("@prisma/client");

async function checkDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log("🔍 Checking database connection...");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Database URL:", process.env.DATABASE_URL ? "Set" : "Not set");

    // Test the connection
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Users in database: ${userCount}`);

    const productCount = await prisma.product.count();
    console.log(`📦 Products in database: ${productCount}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Error details:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
