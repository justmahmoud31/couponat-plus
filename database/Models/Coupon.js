import mongoose from "mongoose";

const CouponSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    cover_image: { type: String },
    link: { type: String },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    discount: { type: Number },
    type: {
      type: String,
      enum: ["show", "cover", "show_half"]
    },
    expireDate: {
      type: Date
    }
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", CouponSchema);
