import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    images: [{ type: String }],
    type: { type: String, enum: ["slider", "static", "two"], required: true },
});
export const Banner = mongoose.model("Banner", BannerSchema);