import { connectDB } from "../dbConnection.js";
import { seedCategories } from "./categorySeeder.js";
import { seedNavigation } from "./navigationSeeder.js";

const runNavigationSeeder = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected for navigation seeding");

    await seedCategories();

    console.log("✅ Navigation seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during navigation seeding:", error);
    process.exit(1);
  }
};

runNavigationSeeder();
