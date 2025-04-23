import { Section } from "../Models/Section.js";
import { Category } from "../Models/Category.js";
import { Store } from "../Models/Store.js";
import { Coupon } from "../Models/Coupon.js";
import mongoose from "mongoose";

export const seedSections = async () => {
  try {
    await Section.deleteMany({});
    console.log("🗑️ Cleared existing sections");

    const categories = await Category.find({}).limit(10);
    const stores = await Store.find({}).limit(10);
    const coupons = await Coupon.find({}).limit(20);

    if (categories.length === 0 || stores.length === 0) {
      console.log("⚠️ No categories or stores found, please seed them first");
      return;
    }

    // Helper function to get random items
    const getRandomItems = (items, count) => {
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      return shuffled
        .slice(0, Math.min(count, items.length))
        .map((item) => item._id);
    };

    // Create sections for the home page
    const sections = [
      // Hero slider section
      {
        title: "عروض مميزة",
        description: "أفضل العروض والكوبونات المميزة لهذا الأسبوع",
        type: "Slider",
        items: getRandomItems(coupons, 5),
        order: 1,
        isActive: true,
      },

      // Categories section
      {
        title: "تصفح حسب الفئات",
        description: "تصفح الكوبونات والعروض حسب الفئات",
        type: "Categories",
        items: getRandomItems(categories, 8),
        order: 2,
        isActive: true,
      },

      // Featured stores section
      {
        title: "المتاجر المميزة",
        description: "تسوق من أفضل المتاجر وحصريًا على موقعنا",
        type: "Stores",
        items: getRandomItems(stores, 6),
        order: 3,
        isActive: true,
      },

      // Best coupons
      {
        title: "أفضل الكوبونات",
        description: "أكثر الكوبونات استخدامًا هذا الشهر",
        type: "Coupons",
        items: getRandomItems(coupons, 8),
        order: 4,
        isActive: true,
      },

      // Banner text section
      {
        title: "خصم إضافي 10%",
        description: "احصل على خصم إضافي 10% عند استخدام كوبون EXTRA10",
        text: "استخدم كوبون EXTRA10 للحصول على خصم إضافي 10% على جميع المشتريات",
        type: "BannerText",
        order: 5,
        isActive: true,
      },

      // Best deals by category
      {
        title: "أفضل عروض الإلكترونيات",
        description: "أفضل عروض الإلكترونيات من المتاجر المميزة",
        type: "bestDealsCategory",
        category_id:
          categories.find((cat) => cat.name.includes("إلكترونيات"))?._id ||
          categories[0]._id,
        items: getRandomItems(
          coupons.filter(
            (coupon) =>
              coupon.category_id &&
              coupon.category_id.toString() ===
                (
                  categories.find((cat) => cat.name.includes("إلكترونيات"))
                    ?._id || categories[0]._id
                ).toString()
          ),
          4
        ),
        order: 6,
        isActive: true,
      },

      // Two banner section
      {
        title: "عروض خاصة",
        description: "عروض خاصة لفترة محدودة",
        type: "TwoBanner",
        items: getRandomItems(coupons, 2),
        order: 7,
        isActive: true,
      },

      // Best stores by category
      {
        title: "أفضل متاجر الأزياء",
        description: "تسوق من أفضل متاجر الأزياء",
        type: "bestStoresCategories",
        category_id:
          categories.find((cat) => cat.name.includes("أزياء"))?._id ||
          categories[1]._id,
        items: getRandomItems(stores, 4),
        order: 8,
        isActive: true,
      },

      // Recent coupons
      {
        title: "أحدث الكوبونات",
        description: "أحدث الكوبونات المضافة حديثًا",
        type: "Coupons",
        items: getRandomItems(coupons, 6),
        order: 9,
        isActive: true,
      },

      // Marketing section
      {
        title: "انضم إلى نشرتنا البريدية",
        description:
          "اشترك في نشرتنا البريدية للحصول على أحدث العروض والكوبونات",
        type: "Marketing",
        text: "كن أول من يعلم بأحدث العروض والكوبونات الحصرية",
        order: 10,
        isActive: true,
      },
    ];

    await Section.insertMany(sections);
    console.log(`✅ Seeded ${sections.length} sections for home page`);
  } catch (error) {
    console.error("❌ Error seeding sections:", error);
    throw error;
  }
};
