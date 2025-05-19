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
      link,
    } = req.body;

    let imageLinks = [];
    if (req.body.imageLinks) {
      try {
        imageLinks = JSON.parse(req.body.imageLinks);
      } catch (err) {
        console.error("Error parsing imageLinks:", err);
      }
    }

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
        const imagePath = typeof image === "object" ? image.path : image;

        if (imagesToDelete.includes(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err)
              console.error(`Error deleting old image: ${imagePath}`, err);
            else console.log(`Successfully deleted image: ${imagePath}`);
          });
          return false;
        }
        return true;
      });
    }

    banner.title = title || banner.title;
    banner.type = type || banner.type;
    if (description !== undefined) {
      banner.description = description;
    }
    if (link !== undefined) {
      banner.link = link;
    }

    const existingImages = banner.images.map((image, index) => {
      if (typeof image === "string") {
        if (imageLinks[index]) {
          return { path: image, link: imageLinks[index] };
        }
        return image;
      } else if (typeof image === "object" && image.path) {
        if (imageLinks[index]) {
          return { ...image, link: imageLinks[index] };
        }
        return image;
      }
      return image;
    });

    const processedNewImages = newImages.map((path, index) => {
      const linkIndex = existingImages.length + index;
      if (imageLinks[linkIndex]) {
        return { path, link: imageLinks[linkIndex] };
      }
      return path;
    });

    banner.images = [...existingImages, ...processedNewImages];
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
