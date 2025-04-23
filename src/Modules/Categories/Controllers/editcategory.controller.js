import fs from "fs-extra";
import path from "path";
import { Category } from "../../../../database/Models/Category.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { validateCategory } from "../categories.validation.js";

export const editCategory = catchError(async (req, res, next) => {
  const { id } = req.params;
  let { name, parent_id, sub_categories, items_count, count } = req.body;

  // Clean up parent_id to ensure it's a proper string or null
  if (parent_id) {
    // Check if parent_id is a stringified JSON object
    try {
      const parsedParentId = JSON.parse(parent_id);
      if (
        parsedParentId &&
        typeof parsedParentId === "object" &&
        parsedParentId._id
      ) {
        parent_id = parsedParentId._id.replace(/^"(.*)"$/, "$1");
      }
    } catch (e) {
      // If it's not valid JSON, just clean any quotes
      parent_id = parent_id.replace(/^"(.*)"$/, "$1");
    }
  }

  const newImage = req.file ? req.file.path.replace(/\\/g, "/") : undefined;

  const { error } = validateCategory({
    name,
    parent_id,
    sub_categories,
    items_count,
    count,
    image: newImage,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((err) => err.message),
    });
  }

  const category = await Category.findById(id);
  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }

  if (newImage && category.image) {
    const oldImagePath = path.join(
      "uploads",
      category.image.replace("uploads/", "")
    );
    if (fs.existsSync(oldImagePath)) {
      fs.removeSync(oldImagePath);
    }
  }

  const oldParentId = category.parent_id ? category.parent_id.toString() : null;

  if (oldParentId && oldParentId !== parent_id) {
    await Category.findByIdAndUpdate(oldParentId, {
      $pull: { sub_categories: id },
    });
  }

  if (parent_id && parent_id !== oldParentId) {
    await Category.findByIdAndUpdate(parent_id, {
      $addToSet: { sub_categories: id },
    });
  }

  const updateData = {
    name,
    parent_id: parent_id || null,
    sub_categories,
    items_count,
    count,
  };

  if (newImage) updateData.image = newImage; 

  const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate("parent_id");

  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category: updatedCategory,
  });
});
