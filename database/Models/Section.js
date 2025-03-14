import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        banner_id: { type: mongoose.Schema.Types.ObjectId, ref: "Banner" },
        store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
        text: { type: String },
        type: {
            type: String,
            enum: [
                "Slider",
                "BannerText",
                "Categories",
                "Coupons",
                "Products",
                "Events",
                "Marketing",
                "Stores",
                "TwoBanner"
            ],
            required: true,
        },
        category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        items: [{ type: mongoose.Schema.Types.ObjectId, refPath: "type" }], // Dynamic reference based on type
        order: { type: Number, required: true, unique: true },
    },
    { timestamps: true }
);

export const Section = mongoose.model("Section", SectionSchema);
