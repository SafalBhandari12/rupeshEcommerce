import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupDatabase() {
  try {
    console.log("Starting database cleanup...");

    // Remove the Wireless Charging Pad product
    const wirelessChargingPad = await prisma.product.findFirst({
      where: { name: "Wireless Charging Pad" },
    });

    if (wirelessChargingPad) {
      await prisma.product.delete({
        where: { id: wirelessChargingPad.id },
      });
      console.log("Removed Wireless Charging Pad product");
    }

    // Remove duplicate products (keep only the ones from production seed)
    const duplicateProducts = [
      "iPhone 15 Pro Max",
      "MacBook Pro 16-inch",
      "Sony WH-1000XM5",
      "Apple Watch Series 9",
      "Premium Cotton T-Shirt",
      "Designer Denim Jeans",
      "Leather Crossbody Bag",
      "Wireless Earbuds Pro",
      "Modern JavaScript Deep Dive",
      "React Design Patterns",
      "Smart Home Hub",
      "Organic Cotton Hoodie",
      "Smart Coffee Maker",
      "Smart LED Light Strip",
      "Indoor Plant Collection",
    ];

    for (const productName of duplicateProducts) {
      const product = await prisma.product.findFirst({
        where: { name: productName },
      });

      if (product) {
        await prisma.product.delete({
          where: { id: product.id },
        });
        console.log(`Removed duplicate product: ${productName}`);
      }
    }

    // Verify the final state
    const remainingProducts = await prisma.product.findMany({
      include: { category: true },
    });

    console.log(`\nFinal database state:`);
    console.log(`Found ${remainingProducts.length} products:`);
    remainingProducts.forEach((product) => {
      console.log(
        `- ${product.name} (${product.category.name}) - $${product.price} - Stock: ${product.stock}`
      );
    });

    console.log("\nDatabase cleanup completed successfully!");
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDatabase();
