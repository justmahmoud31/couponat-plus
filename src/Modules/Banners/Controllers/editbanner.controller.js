
import fs from "fs"; // For deleting old images
import { Banner } from "../../../../database/Models/Banner.js";

export const editBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type } = req.body;
        const newImages = req.files?.map(file => file.path); // Assuming file upload middleware

        // Find the existing banner
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        // If new images are uploaded, delete the old ones
        if (newImages && newImages.length > 0) {
            banner.images.forEach(image => {
                fs.unlink(image, err => {
                    if (err) console.error(`Error deleting old image: ${image}`, err);
                });
            });
        }

        // Update the banner fields
        banner.title = title || banner.title;
        banner.type = type || banner.type;
        if (newImages && newImages.length > 0) {
            banner.images = newImages;
        }

        await banner.save();
        res.status(200).json({ message: "Banner updated successfully", banner });

    } catch (error) {
        console.error("Error updating banner:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
