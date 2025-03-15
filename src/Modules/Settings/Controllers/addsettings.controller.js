import { Settings } from "../../../../database/Models/Settings.js";

export const createSettings = async (req, res) => {
    try {
        const { name, description, emails, socialMedia, copyright } = req.body;

        const newSettings = new Settings({
            logo: req.files?.logo?.[0]?.path || "",
            icon: req.files?.icon?.[0]?.path || "",
            name,
            description,
            emails: emails ? JSON.parse(emails) : [],
            socialMedia: socialMedia ? JSON.parse(socialMedia) : {},
            copyright,
            marketingBanners: req.files?.marketingBanners
                ? req.files.marketingBanners.map(file => file.path)
                : [],
        });

        await newSettings.save();
        res.status(201).json({ message: "Settings created successfully", data: newSettings });
    } catch (error) {
        res.status(500).json({ message: "Error creating settings", error: error.message });
    }
};
