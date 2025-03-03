import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String },
    image: { type: String },
    best: {
        type: String,
        enum: ["bestStoresCategories", "bestCouponCategories", "bestDealsCategory"]
    },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    sub_categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    items_count: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
});
export const Category = mongoose.model("Category", CategorySchema);