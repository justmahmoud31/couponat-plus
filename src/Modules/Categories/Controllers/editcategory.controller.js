import fs from "fs-extra";
import path from "path";
import { Category } from "../../../../database/Models/Category.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { validateCategory } from "../categories.validation.js";

export const editCategory = catchError(async (req, res, next) => {
    const { id } = req.params;
    const { name, parent_id, sub_categories, items_count, count } = req.body;

    // Get the new uploaded file path (if exists)
    const newImage = req.file ? req.file.path.replace(/\\/g, "/") : undefined;

    // Validate input
    const { error } = validateCategory({ name, parent_id, sub_categories, items_count, count, image: newImage });
    if (error) {
        return res.status(400).json({ success: false, message: error.details.map(err => err.message) });
    }

    // Find the existing category to get the old image
    const category = await Category.findById(id);
    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Delete the old image if a new one is uploaded
    if (newImage && category.image) {
        const oldImagePath = path.join("uploads", category.image.replace("uploads/", ""));
        if (fs.existsSync(oldImagePath)) {
            fs.removeSync(oldImagePath);
        }
    }

    // Prepare update data
    const updateData = { name, parent_id, sub_categories, items_count, count };
    if (newImage) updateData.image = newImage; // Only update image if a new one is uploaded

    // Update category in database
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(200).json({ success: true, message: "Category updated successfully", category: updatedCategory });
});
