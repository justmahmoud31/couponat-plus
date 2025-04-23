import { Navigation } from "../Models/Navigation.js";
import { Category } from "../Models/Category.js";

export const seedNavigation = async () => {
  try {
    await Navigation.deleteMany({});
    console.log("✅ Cleared existing navigation items");

    // Get all parent categories (those without a parent_id)
    let parentCategories = await Category.find({
      parent_id: { $exists: false },
    }).populate("sub_categories");

    if (!parentCategories || parentCategories.length === 0) {
      console.log(
        "⚠️ No parent categories found, using all categories instead."
      );
      parentCategories = await Category.find({});
    }

    if (!parentCategories || parentCategories.length === 0) {
      console.log(
        "❌ No categories found to create navigation items. Make sure to run categorySeeder first."
      );
      return;
    }

    console.log(
      `Found ${parentCategories.length} parent categories to create navigation items.`
    );

    // Create navigation items for each parent category
    const navigationItems = [];

    for (const category of parentCategories) {
      // Create main navigation item for the parent category
      navigationItems.push({
        category: category._id,
        label: category.name,
        slug: category.slug,
        sort_order: navigationItems.length + 1,
        isActive: true,
      });

      console.log(
        `Added navigation item for parent category: ${category.name}`
      );

      // If this category has subcategories, add them as well
      if (category.sub_categories && category.sub_categories.length > 0) {
        for (const subCatId of category.sub_categories) {
          // Fetch the subcategory to get its details
          const subCategory = await Category.findById(subCatId);
          if (subCategory) {
            navigationItems.push({
              category: subCategory._id,
              label: subCategory.name,
              slug: subCategory.slug,
              sort_order: navigationItems.length + 1,
              parent: category._id, // Reference to parent category
              isActive: true,
            });
            console.log(
              `  - Added navigation item for subcategory: ${subCategory.name}`
            );
          }
        }
      }
    }

    if (navigationItems.length > 0) {
      await Navigation.insertMany(navigationItems);
      console.log(`✅ Seeded ${navigationItems.length} navigation items`);
    } else {
      console.log("⚠️ No navigation items were created");
    }
  } catch (error) {
    console.error("❌ Error seeding navigation:", error);
    throw error;
  }
};
