
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    cover_image: { type: String },
    link: { type: String },
    code: { type: String },
    brand_name: { type: String },
    price: { type: Number },
    discounted_price: { type: Number },
    category_id: { type: mongoose.Schema.Types.ObjectId,ref: "Category" },
    related_product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});
export const Product = mongoose.model("Product", ProductSchema);