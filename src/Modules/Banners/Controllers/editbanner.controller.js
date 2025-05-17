import fs from "fs";
import { Banner } from "../../../../database/Models/Banner.js";

export const editBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      type,
      deletedImages: rawDeletedImages,
      isActive,
      description,
    } = req.body;
    const newImages = req.files?.images?.map((file) => file.path) || [];
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    let imagesToDelete = [];
    if (rawDeletedImages) {
      try {
        imagesToDelete =
          typeof rawDeletedImages === "string"
            ? JSON.parse(rawDeletedImages)
            : rawDeletedImages;
      } catch (e) {
        imagesToDelete = Array.isArray(rawDeletedImages)
          ? rawDeletedImages
          : [rawDeletedImages];
      }


      banner.images = banner.images.filter((image) => {
        if (imagesToDelete.includes(image)) {
          fs.unlink(image, (err) => {
            if (err) console.error(`Error deleting old image: ${image}`, err);
            else console.log(`Successfully deleted image: ${image}`);
          });
          return false;
        }
        return true; // Keep in array
      });
    }

    // Update banner properties
    banner.title = title || banner.title;
    banner.type = type || banner.type;
    if (description !== undefined) {
      banner.description = description;
    }
    banner.images = [...banner.images, ...newImages];
    banner.isActive = isActive !== undefined ? isActive : banner.isActive;

    await banner.save();
    res.status(200).json({ message: "Banner updated successfully", banner });
  } catch (error) {
    console.error("Error updating banner:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
