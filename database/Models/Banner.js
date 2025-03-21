import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    type: { type: String, enum: ["slider", "static", "two", "bannerText"], required: true },
}, {
    timestamps: true
});
export const Banner = mongoose.model("Banner", BannerSchema);