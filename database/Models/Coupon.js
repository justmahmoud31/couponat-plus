import mongoose from "mongoose";

const CouponSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: false, trim: true },
    description: { type: String, required: false, trim: true },
    image: { type: String, default: null },
    cover_image: { type: String, default: null },
    link: { type: String, required: false, trim: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    discount: { type: Number, default: 0 },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    type: {
      type: String,
      enum: ["show", "cover", "show_half"],
    },
    expireDate: { type: Date },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    usageCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    copyCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    lastActivityDate: { type: Date },
    isVerified: { type: Boolean, default: false },
    highlightText: { type: String, trim: true },
    tabCategory: { type: String },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", CouponSchema);
