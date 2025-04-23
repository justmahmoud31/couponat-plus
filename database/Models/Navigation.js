import mongoose from "mongoose";

const NavigationSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Navigation" },
    label: { type: String, required: true },
    slug: { type: String },
    sort_order: { type: Number },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Navigation = mongoose.model("Navigation", NavigationSchema);
