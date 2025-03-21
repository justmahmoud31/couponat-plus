import fs from "fs";
import { Banner } from "../../../../database/Models/Banner.js";

export const editBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, deletedImages } = req.body;
        const newImages = req.files?.images?.map(file => file.path) || []; 
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }
        // Delete selected images if requested
        if (deletedImages) {
            const imagesToDelete = Array.isArray(deletedImages) ? deletedImages : [deletedImages]; // Ensure it's an array
            banner.images = banner.images.filter(image => {
                if (imagesToDelete.includes(image)) {
                    fs.unlink(image, err => {
                        if (err) console.error(`Error deleting old image: ${image}`, err);
                    });
                    return false; // Remove from array
                }
                return true; // Keep in array
            });
        }
        // Update the banner fields
        banner.title = title || banner.title;
        banner.type = type || banner.type;
        banner.images = [...banner.images, ...newImages]; // Append new images to existing ones

        await banner.save();
        res.status(200).json({ message: "Banner updated successfully", banner });

    } catch (error) {
        console.error("Error updating banner:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
