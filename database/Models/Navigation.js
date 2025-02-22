import mongoose from "mongoose";

const NavigationSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    title: { type: String, required: true },
    href: { type: String, required: true },
    sort_order: { type: Number },
});
export const Navigation = mongoose.model("Navigation", NavigationSchema);