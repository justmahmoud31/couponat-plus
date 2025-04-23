import fs from "fs";
import { Banner } from "../../../../database/Models/Banner.js";

export const editBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, deletedImages, isActive } = req.body;
    const newImages = req.files?.images?.map((file) => file.path) || [];
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    if (deletedImages) {
      const imagesToDelete = Array.isArray(deletedImages)
        ? deletedImages
        : [deletedImages]; 
      banner.images = banner.images.filter((image) => {
        if (imagesToDelete.includes(image)) {
          fs.unlink(image, (err) => {
            if (err) console.error(`Error deleting old image: ${image}`, err);
          });
          return false; 
        }
        return true; 
      });
    }
    banner.title = title || banner.title;
    banner.type = type || banner.type;
    banner.images = [...banner.images, ...newImages];
    banner.isActive = isActive || banner.isActive;
    await banner.save();
    res.status(200).json({ message: "Banner updated successfully", banner });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
