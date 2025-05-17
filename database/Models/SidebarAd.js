import mongoose from "mongoose";

const SidebarAdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    link: { type: String, required: true },
    linkText: { type: String, required: true },
    module: {
      type: String,
      enum: ["store", "coupon", "category", "general"],
      required: true,
    },
    isActive: { type: Boolean, default: true },
    bgColor: { type: String, default: "#00BFA6" },
    textColor: { type: String, default: "#FFFFFF" },
    buttonBgColor: { type: String, default: "#FFFFFF" },
    buttonTextColor: { type: String, default: "#00BFA6" },
    order: { type: Number, default: 1 },
    startDate: { type: Date },
    endDate: { type: Date },
    showOnPages: [{ type: String }],
  },
  { timestamps: true }
);

export const SidebarAd = mongoose.model("SidebarAd", SidebarAdSchema);
