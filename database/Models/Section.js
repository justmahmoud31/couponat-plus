import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        banner_id: { type: mongoose.Schema.Types.ObjectId, ref: "Banner" },
        store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
        text: { type: String },
        type: {
            type: String,
            enum: [
                "Slider",
                "BannerText",
                "Categories",
                "Coupons",
                "Events",
                "Marketing",
                "Stores",
                "TwoBanner"
            ],
            required: true,
        },
        category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        order: { type: Number, required: true, default: 0 }, // Default order
    },
    { timestamps: true }
);

export const Section = mongoose.model("Section", SectionSchema);
