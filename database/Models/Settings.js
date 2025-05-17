import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    logo: { type: String },
    icon: { type: String },
    name: { type: String },
    description: { type: String },
    emails: [{ type: String }],
    socialMedia: {
      x: { type: String },
      whatsapp: { type: String },
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      youtube: { type: String },
    },
    copyright: { type: String },
    marketingBanners: [{ type: String }],
    featuredStores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
      },
    ],
    pages: {
      privacyPolicy: {
        type: String,
        default: "<h1>سياسة الخصوصية</h1><p>محتوى سياسة الخصوصية يظهر هنا.</p>",
      },
      terms: {
        type: String,
        default:
          "<h1>الشروط والأحكام</h1><p>محتوى الشروط والأحكام يظهر هنا.</p>",
      },
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", SettingsSchema);
