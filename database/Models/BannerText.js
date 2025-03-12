import mongoose from "mongoose";

const bannerTextSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    img: { type: String },
    link: { type: String },
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store" }
}, {
    timestamps: true // Corrected key from "Timestamp" to "timestamps"
});

export const BannerText = mongoose.model("BannerText", bannerTextSchema);
