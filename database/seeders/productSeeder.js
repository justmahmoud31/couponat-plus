import { Product } from "../Models/Product.js";
import { Category } from "../Models/Category.js";
import mongoose from "mongoose";

export const seedProducts = async () => {
  try {
    const categories = await Category.find().select("_id name");
    if (categories.length === 0) {
      console.log("⚠️ No categories found, please seed categories first");
      return;
    }

    const getRandomCategory = () => {
      const randomIndex = Math.floor(Math.random() * categories.length);
      return categories[randomIndex]._id;
    };

    const products = [
      {
        title: "هاتف آيفون 15 برو ماكس",
        description: "أحدث هواتف آيفون مع كاميرا متطورة وشاشة OLED",
        price: 4999,
        cover_image: "uploads/products/iphone15-pro.jpg",
        category_id: getRandomCategory(),
      },
      {
        title: "لابتوب ماك بوك برو 16 بوصة",
        description: "لابتوب قوي مع معالج M2 وشاشة 16 بوصة عالية الدقة",
        price: 8999,
        cover_image: "uploads/products/macbook-pro.jpg",
        category_id: getRandomCategory(),
      },
      {
        title: "سماعات ابل ايربودز برو 2",
        description: "سماعات لاسلكية مع خاصية إلغاء الضوضاء",
        price: 899,
        cover_image: "uploads/products/airpods-pro.jpg",
        category_id: getRandomCategory(),
      },
      {
        title: "ساعة ابل ووتش سيريس 9",
        description: "ساعة ذكية مع مستشعرات صحية متقدمة وتصميم أنيق",
        price: 1699,
        cover_image: "uploads/products/apple-watch.jpg",
        category_id: getRandomCategory(),
      },
      {
        title: "تلفزيون سامسونج 65 بوصة QLED",
        description: "تلفزيون ذكي مع تقنية QLED وجودة صورة 4K",
        price: 3499,
        cover_image: "uploads/products/samsung-tv.jpg",
        category_id: getRandomCategory(),
      },
      {
        title: "بلايستيشن 5",
        description: "أحدث جهاز ألعاب من سوني مع تحكم لاسلكي",
        price: 1999,
        cover_image: "uploads/products/ps5.jpg",
        category_id: getRandomCategory(),
      },
      {
        title: "سماعة جيمنج ريزر",
        description: "سماعة ألعاب احترافية مع مايكروفون عالي الجودة",
        price: 499,
        cover_image: "uploads/products/gaming-headset.jpg",
        category_id: getRandomCategory(),
      },
      {
        title: "كاميرا كانون EOS R6",
        description: "كاميرا احترافية من كانون مع مستشعر فل فريم",
        price: 7999,
        cover_image: "uploads/products/canon-camera.jpg",
        category_id: getRandomCategory(),
      },
      {
        title: "مكبر صوت بلوتوث JBL",
        description: "مكبر صوت لاسلكي مقاوم للماء مع جودة صوت استثنائية",
        price: 399,
        cover_image: "uploads/products/jbl-speaker.jpg",
        category_id: getRandomCategory(),
      },
      {
        title: "جهاز آيباد برو 12.9 بوصة",
        description:
          "جهاز لوحي متطور من أبل مع شريحة M2 وشاشة Liquid Retina XDR",
        price: 4499,
        cover_image: "uploads/products/ipad-pro.jpg",
        category_id: getRandomCategory(),
      },
    ];

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
};
