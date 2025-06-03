import fs from "fs-extra";
import path from "path";
import { Coupon } from "../../../../database/Models/Coupon.js";
import { validateCoupon } from "../copouns.validations.js";
import { catchError } from "../../../Middlewares/catchError.js";
import mongoose from "mongoose";

export const updateCoupon = catchError(async (req, res, next) => {
  const { id } = req.params;
  let updateData = req.body;

  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }

  if (req.files?.image && req.files.image[0]) {
    if (coupon.image) {
      const oldImagePath = path.join(process.cwd(), coupon.image);
      if (fs.existsSync(oldImagePath)) {
        await fs.unlink(oldImagePath);
      }
    }
    updateData.image = req.files.image[0].path;
  }

  // Handle cover_image file upload
  if (req.files?.cover_image && req.files.cover_image[0]) {
    // Delete old cover_image if it exists
    if (coupon.cover_image) {
      const oldCoverImagePath = path.join(process.cwd(), coupon.cover_image);
      if (fs.existsSync(oldCoverImagePath)) {
        await fs.unlink(oldCoverImagePath);
      }
    }
    updateData.cover_image = req.files.cover_image[0].path;
  }

  if (updateData.category_id) {
    let categories;

    if (Array.isArray(updateData.category_id)) {
      categories = updateData.category_id;
    } else if (typeof updateData.category_id === "string") {
      // Try to parse as JSON string first (new format)
      try {
        const parsed = JSON.parse(updateData.category_id);
        if (Array.isArray(parsed)) {
          categories = parsed;
          console.log("Successfully parsed category_id JSON:", categories);
        } else {
          // Fallback to old format
          categories = [updateData.category_id];
        }
      } catch (err) {
        // Not JSON, check if it's comma-separated
        if (updateData.category_id.includes(",")) {
          categories = updateData.category_id.split(",");
        } else {
          // Single ID
          categories = [updateData.category_id];
        }
      }
    } else {
      categories = [];
    }

    console.log("Category IDs before processing:", categories);

    // Convert each category ID to ObjectId if valid
    updateData.category_id = categories
      .filter((catId) => mongoose.Types.ObjectId.isValid(catId))
      .map((catId) => new mongoose.Types.ObjectId(catId));

    console.log("Category IDs after processing:", updateData.category_id);
  }

  // Validate updated data using Joi (before ObjectId conversion)
  const { error } = validateCoupon(updateData);
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((err) => err.message),
    });
  }

  // Update the coupon
  const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  res
    .status(200)
    .json({ message: "Coupon updated successfully", coupon: updatedCoupon });
});
