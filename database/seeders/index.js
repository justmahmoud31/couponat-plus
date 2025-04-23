import { connectDB } from "../dbConnection.js";
import { seedSidebar } from "./sidebarSeeder.js";
import { seedCategories } from "./categorySeeder.js";
import { seedStores } from "./storeSeeder.js";
import { seedCoupons } from "./couponSeeder.js";
import { seedProducts } from "./productSeeder.js";
import { seedSections } from "./sectionSeeder.js";
import { seedNavigation } from "./navigationSeeder.js";

const seedData = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected for seeding");

    await seedSidebar();
    await seedCategories();
    await seedStores();
    await seedCoupons();
    await seedProducts();
    await seedSections();
    await seedNavigation();

    console.log("✅ All seeders completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

seedData();
