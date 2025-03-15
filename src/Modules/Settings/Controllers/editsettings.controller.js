import fs from "fs";
import path from "path";
import { Settings } from "../../../../database/Models/Settings.js";
const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};
export const updateSettings = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, emails, socialMedia, copyright } = req.body;

        const existingSettings = await Settings.findById(id);
        if (!existingSettings) {
            return res.status(404).json({ message: "Settings not found" });
        }

        // Handle logo replacement
        if (req.files?.logo) {
            if (existingSettings.logo) deleteFile(existingSettings.logo);
            existingSettings.logo = req.files.logo[0].path;
        }

        // Handle icon replacement
        if (req.files?.icon) {
            if (existingSettings.icon) deleteFile(existingSettings.icon);
            existingSettings.icon = req.files.icon[0].path;
        }

        // Handle marketingBanners replacement
        if (req.files?.marketingBanners) {
            existingSettings.marketingBanners.forEach(deleteFile);
            existingSettings.marketingBanners = req.files.marketingBanners.map(file => file.path);
        }

        // Update other fields
        if (name) existingSettings.name = name;
        if (description) existingSettings.description = description;
        if (emails) existingSettings.emails = JSON.parse(emails);
        if (socialMedia) existingSettings.socialMedia = JSON.parse(socialMedia);
        if (copyright) existingSettings.copyright = copyright;

        await existingSettings.save();
        res.status(200).json({ message: "Settings updated successfully", data: existingSettings });
    } catch (error) {
        res.status(500).json({ message: "Error updating settings", error: error.message });
    }
};