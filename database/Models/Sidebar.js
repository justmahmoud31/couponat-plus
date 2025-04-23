import mongoose from "mongoose";

const SidebarItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    icon: { type: String },
    path: { type: String, required: true },
    order: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Sidebar" },
    description: { type: String },
    badge: { type: String },
    badgeColor: { type: String, default: "bg-accent" },
    roles: [{ type: String, enum: ["user", "admin", "editor"] }], 
    module: {
      type: String,
      enum: ["coupons", "stores", "categories", "products", "users"],
    },
  },
  { timestamps: true }
);

export const Sidebar = mongoose.model("Sidebar", SidebarItemSchema);
