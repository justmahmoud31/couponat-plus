import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
    logo: { type: String },
    icon: { type: String },
    name: { type: String },
    description: { type: String },
    emails: [{ type: String }],
    socialMedia: {
        x: { type: String },
        whatsapp: { type: String },
        facebook: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
        youtube: { type: String },
    },
    copyright: { type: String },
    marketingBanners: [{ type: String }],
}, { timestamps: true });

export const Settings = mongoose.model("Settings", SettingsSchema);
