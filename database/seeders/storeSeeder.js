import { Store } from "../Models/Store.js";
import { Category } from "../Models/Category.js";
import mongoose from "mongoose";

export const seedStores = async () => {
  try {
    // Only add stores if there aren't enough

    // Get categories to associate stores with
    const categories = await Category.find().select("_id name");
    if (categories.length === 0) {
      console.log("⚠️ No categories found, please seed categories first");
      return;
    }

    const getRandomCategory = () => {
      const randomIndex = Math.floor(Math.random() * categories.length);
      return categories[randomIndex]._id;
    };

    const stores = [
      {
        name: "أمازون",
        logo: "uploads/stores/amazon-logo.png",
        cover_image: "uploads/stores/amazon-cover.jpg",
        description: "أكبر متجر للتسوق الإلكتروني في العالم",
        website: "https://www.amazon.sa",
        link: "https://www.amazon.sa",
        category_id: getRandomCategory(),
        numberOfCoupons: Math.floor(Math.random() * 20) + 5,
        is_verified: true,
        social_media: {
          facebook: "https://www.facebook.com/amazon",
          twitter: "https://twitter.com/amazon",
          instagram: "https://www.instagram.com/amazon",
        },
      },
      {
        name: "نون",
        logo: "uploads/stores/noon-logo.png",
        cover_image: "uploads/stores/noon-cover.jpg",
        description: "تسوق أونلاين في السعودية والإمارات",
        website: "https://www.noon.com",
        link: "https://www.noon.com",
        category_id: getRandomCategory(),
        numberOfCoupons: Math.floor(Math.random() * 20) + 5,
        is_verified: true,
        social_media: {
          facebook: "https://www.facebook.com/noon",
          twitter: "https://twitter.com/noon",
          instagram: "https://www.instagram.com/noon",
        },
      },
      {
        name: "جرير",
        logo: "uploads/stores/jarir-logo.png",
        cover_image: "uploads/stores/jarir-cover.jpg",
        description: "مكتبة جرير للكتب والإلكترونيات",
        website: "https://www.jarir.com",
        link: "https://www.jarir.com",
        category_id: getRandomCategory(),
        numberOfCoupons: Math.floor(Math.random() * 20) + 5,
        is_verified: true,
        social_media: {
          facebook: "https://www.facebook.com/jarir",
          twitter: "https://twitter.com/jarir",
          instagram: "https://www.instagram.com/jarir",
        },
      },
      {
        name: "نمشي",
        logo: "uploads/stores/namshi-logo.png",
        cover_image: "uploads/stores/namshi-cover.jpg",
        description: "متجر أزياء وموضة للتسوق أونلاين",
        website: "https://www.namshi.com",
        link: "https://www.namshi.com",
        category_id: getRandomCategory(),
        numberOfCoupons: Math.floor(Math.random() * 20) + 5,
        is_verified: true,
        social_media: {
          facebook: "https://www.facebook.com/namshi",
          twitter: "https://twitter.com/namshi",
          instagram: "https://www.instagram.com/namshi",
        },
      },
      {
        name: "أكسترا",
        logo: "uploads/stores/extra-logo.png",
        cover_image: "uploads/stores/extra-cover.jpg",
        description: "متجر الإلكترونيات والأجهزة المنزلية",
        website: "https://www.extra.com",
        link: "https://www.extra.com",
        category_id: getRandomCategory(),
        numberOfCoupons: Math.floor(Math.random() * 20) + 5,
        is_verified: true,
        social_media: {
          facebook: "https://www.facebook.com/extra",
          twitter: "https://twitter.com/extra",
          instagram: "https://www.instagram.com/extra",
        },
      },
      {
        name: "سنتربوينت",
        logo: "uploads/stores/centrepoint-logo.png",
        cover_image: "uploads/stores/centrepoint-cover.jpg",
        description: "متجر للأزياء والمنزل والجمال",
        website: "https://www.centrepointstores.com",
        link: "https://www.centrepointstores.com",
        category_id: getRandomCategory(),
        numberOfCoupons: Math.floor(Math.random() * 20) + 5,
        is_verified: true,
        social_media: {
          facebook: "https://www.facebook.com/centrepoint",
          twitter: "https://twitter.com/centrepoint",
          instagram: "https://www.instagram.com/centrepoint",
        },
      },
      {
        name: "آيهيرب",
        logo: "uploads/stores/iherb-logo.png",
        cover_image: "uploads/stores/iherb-cover.jpg",
        description: "متجر للفيتامينات والمكملات الغذائية",
        website: "https://www.iherb.com",
        link: "https://www.iherb.com",
        category_id: getRandomCategory(),
        numberOfCoupons: Math.floor(Math.random() * 20) + 5,
        is_verified: true,
        social_media: {
          facebook: "https://www.facebook.com/iherb",
          twitter: "https://twitter.com/iherb",
          instagram: "https://www.instagram.com/iherb",
        },
      },
      {
        name: "شي إن",
        logo: "uploads/stores/shein-logo.png",
        cover_image: "uploads/stores/shein-cover.jpg",
        description: "متجر للأزياء العصرية بأسعار مناسبة",
        website: "https://www.shein.com",
        link: "https://www.shein.com",
        category_id: getRandomCategory(),
        numberOfCoupons: Math.floor(Math.random() * 20) + 5,
        is_verified: true,
        social_media: {
          facebook: "https://www.facebook.com/shein",
          twitter: "https://twitter.com/shein",
          instagram: "https://www.instagram.com/shein",
        },
      },
      {
        name: "العثيم",
        logo: "uploads/stores/othaim-logo.png",
        cover_image: "uploads/stores/othaim-cover.jpg",
        description: "سوبرماركت للبقالة والمواد الغذائية",
        website: "https://www.othaimmarkets.com",
        link: "https://www.othaimmarkets.com",
        category_id: getRandomCategory(),
        numberOfCoupons: Math.floor(Math.random() * 20) + 5,
        is_verified: true,
        social_media: {
          facebook: "https://www.facebook.com/othaim",
          twitter: "https://twitter.com/othaim",
          instagram: "https://www.instagram.com/othaim",
        },
      },
      {
        name: "الشايع",
        logo: "uploads/stores/alshaya-logo.png",
        cover_image: "uploads/stores/alshaya-cover.jpg",
        description: "متجر للماركات العالمية",
        website: "https://www.alshaya.com",
        link: "https://www.alshaya.com",
        category_id: getRandomCategory(),
        numberOfCoupons: Math.floor(Math.random() * 20) + 5,
        is_verified: true,
        social_media: {
          facebook: "https://www.facebook.com/alshaya",
          twitter: "https://twitter.com/alshaya",
          instagram: "https://www.instagram.com/alshaya",
        },
      },
    ];

    await Store.insertMany(stores);
    console.log(`✅ Seeded ${stores.length} stores`);
  } catch (error) {
    console.error("❌ Error seeding stores:", error);
    throw error;
  }
};
