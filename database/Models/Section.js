import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    banner_id: { type: mongoose.Schema.Types.ObjectId, ref: "Banner" },
    text: { type: String },
    type: {
        type: String,
        enum: [
            "stores",
            "coupon_section",
            "deals",
            "banner",
            "text",
            "sidebar",
            "popular_section",
            "flat",
        ],
        required: true,
    },
    categorie: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});
export const Section = mongoose.model("Section", SectionSchema);