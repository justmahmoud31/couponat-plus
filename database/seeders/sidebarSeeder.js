import { Sidebar } from "../Models/Sidebar.js";
import mongoose from "mongoose";

export const seedSidebar = async () => {
  try {
    // Clear existing sidebar items
    await Sidebar.deleteMany({});
    console.log("🗑️ Cleared existing sidebar items");

    // Define sidebar items for different modules
    const sidebarItems = [
      // Coupons Module
      {
        title: "جميع الكوبونات",
        icon: "FaTicketAlt",
        path: "/coupons",
        order: 1,
        isActive: true,
        module: "coupons",
        roles: ["admin"],
        description: "عرض جميع الكوبونات وإدارتها",
      },
      {
        title: "إضافة كوبون جديد",
        icon: "FaPlus",
        path: "/coupons/add",
        order: 2,
        isActive: true,
        module: "coupons",
        roles: ["admin"],
        description: "إضافة كوبون جديد إلى النظام",
      },
      {
        title: "الكوبونات المنتهية",
        icon: "FaClock",
        path: "/coupons/expired",
        order: 3,
        isActive: true,
        module: "coupons",
        roles: ["admin"],
        description: "عرض الكوبونات منتهية الصلاحية",
      },

      // Stores Module
      {
        title: "جميع المتاجر",
        icon: "FaStore",
        path: "/stores",
        order: 1,
        isActive: true,
        module: "stores",
        roles: ["admin"],
        description: "عرض جميع المتاجر وإدارتها",
      },
      {
        title: "إضافة متجر جديد",
        icon: "FaPlus",
        path: "/stores/add",
        order: 2,
        isActive: true,
        module: "stores",
        roles: ["admin"],
        description: "إضافة متجر جديد إلى النظام",
      },
      {
        title: "تقييمات المتاجر",
        icon: "FaStar",
        path: "/stores/ratings",
        order: 3,
        isActive: true,
        module: "stores",
        roles: ["admin"],
        description: "عرض وإدارة تقييمات المتاجر",
      },

      // Categories Module
      {
        title: "جميع الفئات",
        icon: "FaLayerGroup",
        path: "/categories",
        order: 1,
        isActive: true,
        module: "categories",
        roles: ["admin"],
        description: "عرض جميع الفئات وإدارتها",
      },
      {
        title: "إضافة فئة جديدة",
        icon: "FaPlus",
        path: "/categories/add",
        order: 2,
        isActive: true,
        module: "categories",
        roles: ["admin"],
        description: "إضافة فئة جديدة إلى النظام",
      },

      // Products Module
      {
        title: "جميع المنتجات",
        icon: "FaBoxOpen",
        path: "/products",
        order: 1,
        isActive: true,
        module: "products",
        roles: ["admin"],
        description: "عرض جميع المنتجات وإدارتها",
      },
      {
        title: "إضافة منتج جديد",
        icon: "FaPlus",
        path: "/products/add",
        order: 2,
        isActive: true,
        module: "products",
        roles: ["admin"],
        description: "إضافة منتج جديد إلى النظام",
      },

      // Users Module
      {
        title: "جميع المستخدمين",
        icon: "FaUsers",
        path: "/users",
        order: 1,
        isActive: true,
        module: "users",
        roles: ["admin"],
        description: "عرض جميع المستخدمين وإدارتهم",
      },
      {
        title: "إضافة مستخدم جديد",
        icon: "FaUserPlus",
        path: "/users/add",
        order: 2,
        isActive: true,
        module: "users",
        roles: ["admin"],
        description: "إضافة مستخدم جديد إلى النظام",
      },
    ];

    // Insert sidebar items
    await Sidebar.insertMany(sidebarItems);
    console.log(`✅ Seeded ${sidebarItems.length} sidebar items`);
  } catch (error) {
    console.error("❌ Error seeding sidebar items:", error);
    throw error;
  }
};
