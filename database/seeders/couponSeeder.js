import { Coupon } from "../Models/Coupon.js";
import { Store } from "../Models/Store.js";
import { Category } from "../Models/Category.js";
import mongoose from "mongoose";

export const seedCoupons = async () => {
  try {
    const stores = await Store.find().select("_id name");
    if (stores.length === 0) {
      console.log("⚠️ No stores found, please seed stores first");
      return;
    }

    const categories = await Category.find().select("_id name");
    if (categories.length === 0) {
      console.log("⚠️ No categories found, please seed categories first");
      return;
    }

    const getRandomStore = () => {
      const randomIndex = Math.floor(Math.random() * stores.length);
      return stores[randomIndex]._id;
    };

    const getMatchingCategory = (couponType) => {
      let categoryName = "";

      switch (couponType) {
        case "electronics":
          categoryName = "إلكترونيات";
          break;
        case "fashion":
          categoryName = "أزياء";
          break;
        case "home":
          categoryName = "منزل وحديقة";
          break;
        case "beauty":
          categoryName = "صحة وجمال";
          break;
        case "sports":
          categoryName = "رياضة وترفيه";
          break;
        default:
          const randomIndex = Math.floor(Math.random() * categories.length);
          return categories[randomIndex]._id;
      }

      const matchingCategory = categories.find(
        (category) => category.name === categoryName
      );
      return matchingCategory ? matchingCategory._id : categories[0]._id;
    };

    const getRandomExpiryDate = () => {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(now.getDate() + Math.floor(Math.random() * 30) + 1);
      return futureDate;
    };

    const generateCode = (prefix) => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = prefix;
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    const getRandomType = () => {
      const types = ["show", "cover", "show_half"];
      return types[Math.floor(Math.random() * types.length)];
    };

    const coupons = [
      {
        title: "خصم 15% على الإلكترونيات",
        description: "استمتع بخصم 15% على جميع الإلكترونيات",
        code: generateCode("ELEC"),
        type: getRandomType(),
        discount_value: 15,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("electronics"),
        image: "uploads/coupons/electronics-discount.jpg",
        cover_image: "uploads/coupons/electronics-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 100 ريال على المشتريات فوق 500 ريال",
        description:
          "استمتع بخصم 100 ريال على جميع المشتريات التي تزيد عن 500 ريال",
        code: generateCode("SHOP"),
        type: getRandomType(),
        discount_value: 100,
        discount_type: "fixed",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("fashion"),
        image: "uploads/coupons/shopping-discount.jpg",
        cover_image: "uploads/coupons/shopping-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "شحن مجاني لجميع الطلبات",
        description: "استمتع بشحن مجاني لجميع الطلبات دون حد أدنى للطلب",
        code: generateCode("FREE"),
        type: getRandomType(),
        discount_value: 0,
        discount_type: "shipping",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("home"),
        image: "uploads/coupons/free-shipping.jpg",
        cover_image: "uploads/coupons/shipping-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 25% على الملابس",
        description: "استمتع بخصم 25% على جميع الملابس والأزياء",
        code: generateCode("FASH"),
        type: getRandomType(),
        discount_value: 25,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("fashion"),
        image: "uploads/coupons/fashion-discount.jpg",
        cover_image: "uploads/coupons/fashion-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 10% على الكتب",
        description: "استمتع بخصم 10% على جميع الكتب والمنتجات التعليمية",
        code: generateCode("BOOK"),
        type: getRandomType(),
        discount_value: 10,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("home"),
        image: "uploads/coupons/books-discount.jpg",
        cover_image: "uploads/coupons/books-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 20% على مستحضرات التجميل",
        description:
          "استمتع بخصم 20% على جميع مستحضرات التجميل والعناية الشخصية",
        code: generateCode("BEAUTY"),
        type: getRandomType(),
        discount_value: 20,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("beauty"),
        image: "uploads/coupons/beauty-discount.jpg",
        cover_image: "uploads/coupons/beauty-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 150 ريال على الأثاث",
        description: "استمتع بخصم 150 ريال على جميع منتجات الأثاث والمنزل",
        code: generateCode("HOME"),
        type: getRandomType(),
        discount_value: 150,
        discount_type: "fixed",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("home"),
        image: "uploads/coupons/furniture-discount.jpg",
        cover_image: "uploads/coupons/furniture-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 15% على الرياضة",
        description:
          "استمتع بخصم 15% على جميع المنتجات الرياضية ومعدات اللياقة",
        code: generateCode("SPORT"),
        type: getRandomType(),
        discount_value: 15,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("sports"),
        image: "uploads/coupons/sports-discount.jpg",
        cover_image: "uploads/coupons/sports-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 30% على الأحذية",
        description: "استمتع بخصم 30% على جميع الأحذية الرياضية والرسمية",
        code: generateCode("SHOES"),
        type: getRandomType(),
        discount_value: 30,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("fashion"),
        image: "uploads/coupons/shoes-discount.jpg",
        cover_image: "uploads/coupons/shoes-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 20% على البقالة",
        description: "استمتع بخصم 20% على جميع منتجات البقالة والمواد الغذائية",
        code: generateCode("GROC"),
        type: getRandomType(),
        discount_value: 20,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("home"),
        image: "uploads/coupons/grocery-discount.jpg",
        cover_image: "uploads/coupons/grocery-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 50% على العناية بالبشرة",
        description: "استمتع بخصم 50% على منتجات العناية بالبشرة",
        code: generateCode("SKIN"),
        type: getRandomType(),
        discount_value: 50,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("beauty"),
        image: "uploads/coupons/skincare-discount.jpg",
        cover_image: "uploads/coupons/skincare-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 40% على الهواتف الذكية",
        description: "استمتع بخصم 40% على جميع الهواتف الذكية والأجهزة اللوحية",
        code: generateCode("PHONE"),
        type: getRandomType(),
        discount_value: 40,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("electronics"),
        image: "uploads/coupons/phones-discount.jpg",
        cover_image: "uploads/coupons/phones-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 200 ريال على الحجوزات",
        description: "استمتع بخصم 200 ريال على جميع حجوزات الفنادق والسفر",
        code: generateCode("TRAVEL"),
        type: getRandomType(),
        discount_value: 200,
        discount_type: "fixed",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("travel"),
        image: "uploads/coupons/travel-discount.jpg",
        cover_image: "uploads/coupons/travel-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 25% على المطاعم",
        description: "استمتع بخصم 25% على الطلبات من المطاعم والمقاهي",
        code: generateCode("FOOD"),
        type: getRandomType(),
        discount_value: 25,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("food"),
        image: "uploads/coupons/food-discount.jpg",
        cover_image: "uploads/coupons/food-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 15% على الألعاب",
        description: "استمتع بخصم 15% على جميع الألعاب والهدايا",
        code: generateCode("GAME"),
        type: getRandomType(),
        discount_value: 15,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("sports"),
        image: "uploads/coupons/games-discount.jpg",
        cover_image: "uploads/coupons/games-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
    ];

    // Add more coupons for different categories
    const additionalCoupons = [
      {
        title: "خصم 35% على أجهزة الكمبيوتر المحمولة",
        description: "استمتع بخصم 35% على جميع أجهزة الكمبيوتر المحمولة",
        code: generateCode("LAPTOP"),
        type: getRandomType(),
        discount_value: 35,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("electronics"),
        image: "uploads/coupons/laptop-discount.jpg",
        cover_image: "uploads/coupons/laptop-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 25% على التلفزيونات الذكية",
        description: "استمتع بخصم 25% على جميع التلفزيونات الذكية",
        code: generateCode("TV"),
        type: getRandomType(),
        discount_value: 25,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("electronics"),
        image: "uploads/coupons/tv-discount.jpg",
        cover_image: "uploads/coupons/tv-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 20% على الساعات الذكية",
        description: "استمتع بخصم 20% على جميع الساعات الذكية",
        code: generateCode("WATCH"),
        type: getRandomType(),
        discount_value: 20,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("electronics"),
        image: "uploads/coupons/watch-discount.jpg",
        cover_image: "uploads/coupons/watch-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 30% على الفساتين",
        description: "استمتع بخصم 30% على تشكيلة الفساتين",
        code: generateCode("DRESS"),
        type: getRandomType(),
        discount_value: 30,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("fashion"),
        image: "uploads/coupons/dress-discount.jpg",
        cover_image: "uploads/coupons/dress-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 40% على الحقائب",
        description: "استمتع بخصم 40% على جميع الحقائب",
        code: generateCode("BAG"),
        type: getRandomType(),
        discount_value: 40,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("fashion"),
        image: "uploads/coupons/bag-discount.jpg",
        cover_image: "uploads/coupons/bag-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 45% على نظارات الشمس",
        description: "استمتع بخصم 45% على جميع نظارات الشمس",
        code: generateCode("SUN"),
        type: getRandomType(),
        discount_value: 45,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("fashion"),
        image: "uploads/coupons/sunglass-discount.jpg",
        cover_image: "uploads/coupons/sunglass-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 15% على الأثاث المنزلي",
        description: "استمتع بخصم 15% على الأثاث المنزلي",
        code: generateCode("FURN"),
        type: getRandomType(),
        discount_value: 15,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("home"),
        image: "uploads/coupons/furniture-alt-discount.jpg",
        cover_image: "uploads/coupons/furniture-alt-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 25% على أدوات المطبخ",
        description: "استمتع بخصم 25% على جميع أدوات المطبخ",
        code: generateCode("KITCHEN"),
        type: getRandomType(),
        discount_value: 25,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("home"),
        image: "uploads/coupons/kitchen-discount.jpg",
        cover_image: "uploads/coupons/kitchen-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 30% على مستلزمات الحديقة",
        description: "استمتع بخصم 30% على جميع مستلزمات الحديقة",
        code: generateCode("GARDEN"),
        type: getRandomType(),
        discount_value: 30,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("home"),
        image: "uploads/coupons/garden-discount.jpg",
        cover_image: "uploads/coupons/garden-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 40% على العطور",
        description: "استمتع بخصم 40% على تشكيلة العطور",
        code: generateCode("PERF"),
        type: getRandomType(),
        discount_value: 40,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("beauty"),
        image: "uploads/coupons/perfume-discount.jpg",
        cover_image: "uploads/coupons/perfume-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 30% على مستحضرات المكياج",
        description: "استمتع بخصم 30% على جميع مستحضرات المكياج",
        code: generateCode("MAKEUP"),
        type: getRandomType(),
        discount_value: 30,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("beauty"),
        image: "uploads/coupons/makeup-discount.jpg",
        cover_image: "uploads/coupons/makeup-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 35% على منتجات العناية بالشعر",
        description: "استمتع بخصم 35% على منتجات العناية بالشعر",
        code: generateCode("HAIR"),
        type: getRandomType(),
        discount_value: 35,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("beauty"),
        image: "uploads/coupons/hair-discount.jpg",
        cover_image: "uploads/coupons/hair-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 25% على الملابس الرياضية",
        description: "استمتع بخصم 25% على جميع الملابس الرياضية",
        code: generateCode("SPORTWEAR"),
        type: getRandomType(),
        discount_value: 25,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("sports"),
        image: "uploads/coupons/sportswear-discount.jpg",
        cover_image: "uploads/coupons/sportswear-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 30% على معدات التمارين",
        description: "استمتع بخصم 30% على جميع معدات التمارين",
        code: generateCode("FITNESS"),
        type: getRandomType(),
        discount_value: 30,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("sports"),
        image: "uploads/coupons/fitness-discount.jpg",
        cover_image: "uploads/coupons/fitness-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
      {
        title: "خصم 20% على معدات التخييم",
        description: "استمتع بخصم 20% على جميع معدات التخييم",
        code: generateCode("CAMP"),
        type: getRandomType(),
        discount_value: 20,
        discount_type: "percentage",
        expireDate: getRandomExpiryDate(),
        store_id: getRandomStore(),
        category_id: getMatchingCategory("sports"),
        image: "uploads/coupons/camping-discount.jpg",
        cover_image: "uploads/coupons/camping-cover.jpg",
        isVerified: true,
        usageCount: Math.floor(Math.random() * 100) + 10,
      },
    ];

    const allCoupons = [...coupons, ...additionalCoupons];
    await Coupon.insertMany(allCoupons);
    console.log(`✅ Seeded ${allCoupons.length} coupons`);
  } catch (error) {
    console.error("❌ Error seeding coupons:", error);
    throw error;
  }
};
