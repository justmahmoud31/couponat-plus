import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
    logo: { type: String },
    description: { type: String },
    icon: { type: String },
    scripts: { type: String },
});
export const Settings = mongoose.model("Settings", SettingsSchema);